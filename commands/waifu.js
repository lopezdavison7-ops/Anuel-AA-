import axios from 'axios';
import { buscarWaifu } from '../lib/api.js';

export default {
    nombre: 'waifu',
    alias: ['anime'],
    categoria: 'ANIME',

    ejecutar: async ({ responder }) => {
        try {
            const res = await buscarWaifu();
            const url = res.url || res.image;
            if (url) {
                const buffer = (await axios.get(url, { responseType: 'arraybuffer' })).data;
                await responder.imagen(Buffer.from(buffer), '🌸 Waifu');
            }
        } catch {
            await responder.texto('❌ Error al buscar waifu');
        }
    }
};