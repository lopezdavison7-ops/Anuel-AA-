import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = path.join(__dirname, '../commands');

export async function loadCommands() {
    const comandos = new Map();
    if (!fs.existsSync(COMMANDS_DIR)) return comandos;

    const archivos = fs.readdirSync(COMMANDS_DIR).filter(f => f.endsWith('.js'));

    for (const archivo of archivos) {
        try {
            const ruta = path.join(COMMANDS_DIR, archivo);
            const modulo = await import(ruta);
            const cmd = modulo.default || modulo;
            if (cmd?.nombre && cmd?.ejecutar) {
                comandos.set(cmd.nombre.toLowerCase(), cmd);
                cmd.alias?.forEach(alias => comandos.set(alias.toLowerCase(), cmd));
            }
        } catch (error) {
            console.error(`[CMD] Error cargando ${archivo}:`, error.message);
        }
    }
    return comandos;
}