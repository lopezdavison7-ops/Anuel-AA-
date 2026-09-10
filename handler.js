import { loadCommands } from './controllers/cmdManager.js';
import { crearResponder } from './lib/responder.js';
import { registrarComando } from './lib/estadisticas.js';

let comandos = null;

export async function handleMessage(sock, msg, prefijo = '.', listaComandos = []) {
    try {
        if (!comandos) comandos = await loadCommands();
        if (!msg.message) return;
        if (msg.key.remoteJid === 'status@broadcast') return;

        const jid = msg.key.remoteJid;
        const isGroup = jid?.endsWith('@g.us');

        let texto = msg.message?.conversation || 
                    msg.message?.extendedTextMessage?.text || 
                    msg.message?.imageMessage?.caption || '';

        if (!texto || !texto.startsWith(prefijo)) return;

        const sinPrefijo = texto.slice(prefijo.length).trim();
        const idx = sinPrefijo.search(/\s/);
        const nombreComando = (idx === -1 ? sinPrefijo : sinPrefijo.slice(0, idx)).toLowerCase();
        const argumento = idx === -1 ? '' : sinPrefijo.slice(idx + 1);
        const args = argumento ? argumento.split(' ') : [];

        let cmd = comandos.get(nombreComando);
        if (!cmd) cmd = [...comandos.values()].find(c => c.alias?.includes(nombreComando));
        if (!cmd) return;

        registrarComando(nombreComando);
        const responder = crearResponder(sock, jid, msg);
        const botJid = sock.user.id;

        await cmd.ejecutar({ sock, msg, args, argumento, prefijo, isGroup, jid, botJid, responder });
    } catch (error) {
        console.error('[HANDLER]', error.message);
    }
}