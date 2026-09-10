import fs from 'fs';

export default {
    nombre: 'saldo',
    alias: ['balance', 'mastercoins', 'coins'],
    categoria: 'ECONOMIA',

    ejecutar: async ({ msg, responder }) => {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        let db = {};
        try { db = JSON.parse(fs.readFileSync('./database/economia.json', 'utf8')); } catch {}
        const saldo = db[senderJid]?.saldo || 0;
        
        const diseño = `╭━━━━━━━━━━━━━━╮
┃ 💳 *SALDO*
┃ 💰 $${saldo.toLocaleString()}
╰━━━━━━━━━━━━━━╯`;
        
        await responder.texto(diseño);
    }
};