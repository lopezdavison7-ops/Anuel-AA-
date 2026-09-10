import axios from 'axios';
import { descargarYouTubeAudio } from '../lib/api.js';

export default {
    nombre: 'yta',
    alias: ['ytaudio', 'ytmp3', 'musica'],
    categoria: 'DOWNLOADER',

    ejecutar: async ({ argumento, responder }) => {
        if (!argumento) return responder.texto('❌ Pega el link o nombre de la canción');
        try {
            await responder.texto('🎵 Buscando audio...');
            const res = await descargarYouTubeAudio(argumento);
            const url = res.audio || res.url;
            if (url) {
                const buffer = (await axios.get(url, { responseType: 'arraybuffer' })).data;
                await responder.audio(Buffer.from(buffer), false);
            }
        } catch {
            await responder.texto('❌ Error al descargar audio');
        }
    }
};