import fs from 'fs';

export default {
    nombre: 'menu',
    alias: ['help', 'ayuda', 'comandos'],
    categoria: 'GENERAL',

    ejecutar: async ({ msg, responder }) => {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const nombre = senderJid.split('@')[0];
        
        let usuarios = 0;
        try {
            const db = JSON.parse(fs.readFileSync('./database/usuarios.json', 'utf8'));
            usuarios = Object.keys(db).length;
        } catch {}

        const menu = `╭──────────────────╮
│    🎤 *ANUEL AA* 🎤
│   Real Hasta La Muerte
╰──────────────────╯

👋 Hey @${nombre}!
📍 Managua, Nicaragua 🇳🇮

📊 Usuarios: ${usuarios}
⚡ Prefijo: .

━━━━━━━━━━━━━━━━━━

🤖 *INTELIGENCIA ARTIFICIAL*
│ .ia • .ai • .chatgpt

🌸 *ANIME*
│ .waifu • .anime

📥 *DESCARGAS*
│ .apk • .ytv • .ytmp4

⬇️ *DOWNLOADER*
│ .tiktok • .tt
│ .yta • .ytaudio
│ .pinterest • .pin

💰 *ECONOMÍA*
│ .daily • .saldo
│ .balance • .coins

⚙️ *GENERAL*
│ .ping • .p
│ .info • .status
│ .reg • .register
│ .sticker • .s

🔧 *HERRAMIENTAS*
│ .qr • .shorturl
│ .password • .pass

🎵 *MÚSICA*
│ .lyrics • .letra
│ .yts • .ytsearch

👤 *USUARIO*
│ .perfil • .profile

👑 *OWNER*
│ .savefile

━━━━━━━━━━━━━━━━━━

💯 *ANUEL AA* 💯
_2026 © Todos los derechos reservados_`;

        await responder.texto(menu);
    }
};