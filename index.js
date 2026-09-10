import 'dotenv/config';
import * as baileysNS from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import Fastify from 'fastify';
import pino from 'pino';
import NodeCache from 'node-cache';
import readline from 'readline';
import fs from 'fs';
import { CONFIG } from './config.js';
import { handleMessage } from './handler.js';
import { loadCommands } from './controllers/cmdManager.js';

const baileys = baileysNS.default ?? baileysNS;
const makeWASocket = typeof baileys === 'function' ? baileys : baileys.makeWASocket;
const useMultiFileAuthState = baileysNS.useMultiFileAuthState;
const DisconnectReason = baileysNS.DisconnectReason;
const fetchLatestBaileysVersion = baileysNS.fetchLatestBaileysVersion;
const Browsers = baileysNS.Browsers;
const makeCacheableSignalKeyStore = baileysNS.makeCacheableSignalKeyStore;

const AUTH_FOLDER = './auth_info';
let intentos = 0;
let iniciando = false;
let comandos = null;

// Servidor HTTP
const app = Fastify({ logger: false });
app.get('/', async () => ({ status: 'online', bot: CONFIG.BOT_NAME }));
app.listen({ port: CONFIG.PORT, host: '0.0.0.0' })
    .then(() => console.log(`🌐 Servidor activo en puerto ${CONFIG.PORT}`));

const msgRetryCounterCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// ⭐ FUNCIÓN PARA PEDIR NÚMERO EN CONSOLA
function pedirNumero() {
    return new Promise(resolve => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        console.log('\n╔══════════════════════════════════════╗');
        console.log('║     🎤 ANUEL AA - CONFIGURACIÓN     ║');
        console.log('╚══════════════════════════════════════╝');
        rl.question('\n📱 Número a vincular (con código de país):\n> ', respuesta => {
            rl.close();
            const numero = respuesta.trim().replace(/\D/g, '');
            if (!numero || numero.length < 8) {
                console.log('❌ Número inválido. Intenta de nuevo.');
                return resolve(pedirNumero());
            }
            resolve(numero);
        });
    });
}

async function iniciarBot() {
    if (iniciando) return;
    iniciando = true;
    
    try {
        console.log(`\n🎤 Iniciando ${CONFIG.BOT_NAME}...`);
        const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
        
        let numeroTelefono = null;
        
        // ⭐ SI NO HAY SESIÓN, PREGUNTA EL NÚMERO
        if (!state.creds.registered) {
            numeroTelefono = await pedirNumero();
            console.log(`\n✅ Número: ${numeroTelefono}`);
            console.log('⏳ Generando código de vinculación...\n');
        }

        let version;
        try {
            const res = await fetchLatestBaileysVersion();
            version = res.version;
        } catch {}

        comandos = await loadCommands();
        console.log(`📦 Comandos cargados: ${comandos.size}`);

        const logger = pino({ level: 'silent' });
        const sock = makeWASocket({
            logger,
            printQRInTerminal: false,
            browser: Browsers.macOS('Chrome'),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger)
            },
            markOnlineOnConnect: true,
            syncFullHistory: false,
            msgRetryCounterCache,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 30000,
            keepAliveIntervalMs: 20000,
            emitOwnEvents: true,
            getMessage: async () => undefined,
            ...(version && { version })
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async update => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'open') {
                intentos = 0;
                console.log('\n╔══════════════════════════════════════╗');
                console.log('║     ✅ ANUEL AA CONECTADO 🎤        ║');
                console.log('╚══════════════════════════════════════╝\n');
            }

            if (connection === 'close') {
                const codigoError = new Boom(lastDisconnect?.error)?.output?.statusCode || 0;
                if (codigoError === DisconnectReason.loggedOut) {
                    console.log('🔒 Sesión cerrada. Reinicia el bot.');
                    return;
                }
                intentos++;
                setTimeout(() => { iniciando = false; iniciarBot(); }, Math.min(5000 * intentos, 60000));
            }
        });

        sock.ev.on('messages.upsert', async ({ messages }) => {
            const m = messages[0];
            if (!m.message || m.key.remoteJid === 'status@broadcast') return;
            handleMessage(sock, m, CONFIG.PREFIX, Array.from(comandos.values()));
        });

        // ⭐ GENERAR CÓDIGO DE 8 DÍGITOS
        if (!state.creds.registered && numeroTelefono) {
            setTimeout(async () => {
                try {
                    const codigo = await sock.requestPairingCode(numeroTelefono);
                    const formato = codigo.match(/.{1,4}/g)?.join('-') || codigo;
                    console.log('╔══════════════════════════════════════╗');
                    console.log('║   🔑 CÓDIGO DE VINCULACIÓN          ║');
                    console.log(`║   ➤ ${formato} ◄`);
                    console.log('║                                      ║');
                    console.log('║   WhatsApp > Dispositivos vinculados ║');
                    console.log('║   > Vincular con número              ║');
                    console.log('╚══════════════════════════════════════╝\n');
                } catch (e) {
                    console.error('❌ Error generando código:', e.message);
                }
            }, 3000);
        }

        iniciando = false;
    } catch (error) {
        iniciando = false;
        console.error('❌ Error:', error.message);
        setTimeout(iniciarBot, 5000);
    }
}

iniciarBot();