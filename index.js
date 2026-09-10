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
let metodoConexion = null;
let numeroTelefono = null;
let intentos = 0;
let iniciando = false;
let comandos = null;

// Servidor HTTP
const app = Fastify({ logger: false });
app.get('/', async () => ({ status: 'online', bot: CONFIG.BOT_NAME }));
app.listen({ port: CONFIG.PORT, host: '0.0.0.0' })
    .then(() => console.log(`🌐 Servidor activo en puerto ${CONFIG.PORT}`));

const msgRetryCounterCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

function preguntarNumero() {
    return new Promise(resolve => {
        if (CONFIG.BOT_PHONE_NUMBER) return resolve(CONFIG.BOT_PHONE_NUMBER);
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('📱 Número: ', n => { rl.close(); resolve(n.replace(/\D/g, '')); });
    });
}

async function iniciarBot() {
    if (iniciando) return;
    iniciando = true;
    
    try {
        console.log(`\n🎤 Iniciando ${CONFIG.BOT_NAME}...`);
        const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
        
        if (!state.creds.registered) {
            numeroTelefono = await preguntarNumero();
            metodoConexion = 'codigo';
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
                console.log(`\n✅ ${CONFIG.BOT_NAME} CONECTADO 🎤\n`);
            }

            if (connection === 'close') {
                const codigoError = new Boom(lastDisconnect?.error)?.output?.statusCode || 0;
                if (codigoError === DisconnectReason.loggedOut) return;
                intentos++;
                setTimeout(() => { iniciando = false; iniciarBot(); }, Math.min(5000 * intentos, 60000));
            }
        });

        sock.ev.on('messages.upsert', async ({ messages }) => {
            const m = messages[0];
            if (!m.message || m.key.remoteJid === 'status@broadcast') return;
            handleMessage(sock, m, CONFIG.PREFIX, Array.from(comandos.values()));
        });

        if (!state.creds.registered && metodoConexion === 'codigo') {
            setTimeout(async () => {
                try {
                    const codigo = await sock.requestPairingCode(numeroTelefono);
                    console.log(`\n🔐 CÓDIGO: ${codigo.match(/.{1,4}/g)?.join('-')}\n`);
                } catch (e) { console.error('Error:', e.message); }
            }, 4000);
        }

        iniciando = false;
    } catch (error) {
        iniciando = false;
        console.error('❌ Error:', error.message);
        setTimeout(iniciarBot, 5000);
    }
}

iniciarBot();