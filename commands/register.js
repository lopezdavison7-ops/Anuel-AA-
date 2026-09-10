import fs from 'fs';

export default {
    nombre: 'reg',
    alias: ['register', 'registrar'],
    categoria: 'GENERAL',

    ejecutar: async ({ msg, responder }) => {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const DB_FILE = './database/usuarios.json';
        
        if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
        
        let db = {};
        try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch {}
        
        if (db[senderJid]) return responder.texto('⚠️ Ya estás registrado');
        
        db[senderJid] = { registrado: true, fecha: Date.now() };
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        
        await responder.texto(`✅ Registrado!\n📱 ${senderJid.split('@')[0]}\n🎤 Bienvenido a ANUEL AA`);
    }
};