import fs from 'fs';

const STATS_FILE = './database/stats.json';

export function registrarComando(nombre) {
    try {
        if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
        let stats = { comandos: {}, total: 0 };
        if (fs.existsSync(STATS_FILE)) stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
        stats.comandos[nombre] = (stats.comandos[nombre] || 0) + 1;
        stats.total = (stats.total || 0) + 1;
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    } catch {}
}