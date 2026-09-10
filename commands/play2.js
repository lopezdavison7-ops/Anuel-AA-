import axios from 'axios';
import { descargarYouTubeVideo } from '../lib/api.js';

export default {
    nombre: 'ytv',
    alias: ['ytmp4', 'video'],
    categoria: 'DESCARGAS',

    ejecutar: async ({ argumento, responder }) => {
        if (!argumento) return responder.texto('❌ Pega el link o nombre del video');
        try {
            await responder.texto('🎬 Descargando video...');
            const res = await descargarYouTubeVideo(argumento);
            const url = res.video || res.url;
            if (url) {
                const buffer = (await axios.get(url, { responseType: 'arraybuffer' })).data;
                await responder.video(Buffer.from(buffer), '🎥 Video de YouTube');
            }
        } catch {
            await responder.texto('❌ Error al descargar video');
        }
    }
};