import fs from 'fs';

export default {
    nombre: 'daily',
    alias: ['diario'],
    categoria: 'ECONOMIA',

    ejecutar: async ({ msg, responder }) => {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const DB_FILE = './database/economia.json';
        
        if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
        
        let db = {};
        try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch {}
        
        if (!db[senderJid]) db[senderJid] = { saldo: 0, ultimoDaily: 0 };
        
        const ahora = Date.now();
        const limite = 24 * 60 * 60 * 1000;
        
        if (ahora - db[senderJid].ultimoDaily < limite) {
            const horas = Math.ceil((limite - (ahora - db[senderJid].ultimoDaily)) / 3600000);
            return responder.texto(`⏳ Vuelve en ${horas}h`);
        }
        
        const recompensa = 500 + Math.floor(Math.random() * 500);
        db[senderJid].saldo += recompensa;
        db[senderJid].ultimoDaily = ahora;
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        
        await responder.texto(`💰 Recompensa diaria: +$${recompensa}\n💳 Saldo: $${db[senderJid].saldo}`);
    }
};