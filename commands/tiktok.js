import axios from 'axios';
import { descargarTikTok } from '../lib/api.js';

export default {
    nombre: 'tiktok',
    alias: ['tt', 'ttdl', 'tiktokdl'],
    categoria: 'DOWNLOADER',

    ejecutar: async ({ argumento, responder }) => {
        if (!argumento) return responder.texto('❌ Pega el link de TikTok');
        try {
            await responder.texto('⏳ Descargando TikTok...');
            const res = await descargarTikTok(argumento);
            const url = res.video || res.url || res.result;
            if (url) {
                const buffer = (await axios.get(url, { responseType: 'arraybuffer' })).data;
                await responder.video(Buffer.from(buffer), '🎬 TikTok descargado');
            }
        } catch {
            await responder.texto('❌ Error al descargar');
        }
    }
};