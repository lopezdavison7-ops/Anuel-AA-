import fs from 'fs';

export default {
    nombre: 'perfil',
    alias: ['profile'],
    categoria: 'USUARIO',

    ejecutar: async ({ msg, responder }) => {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const numero = senderJid.split('@')[0];
        
        let db = {};
        try { db = JSON.parse(fs.readFileSync('./database/economia.json', 'utf8')); } catch {}
        const saldo = db[senderJid]?.saldo || 0;
        
        const diseño = `╭━━━━━━━━━━━━━━╮
┃ 👤 *PERFIL*
┃ 📱 ${numero}
┃ 💰 Saldo: $${saldo}
┃ 🎤 Bot: ANUEL AA
╰━━━━━━━━━━━━━━╯`;
        
        await responder.texto(diseño);
    }
};