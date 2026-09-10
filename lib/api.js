import axios from 'axios';
import { CONFIG } from '../config.js';

export async function apiRequest(endpoint, params = {}) {
    try {
        const url = `${CONFIG.ALEX_API_URL}${endpoint}`;
        const response = await axios.get(url, {
            params: { apikey: CONFIG.ALEX_API_KEY, ...params },
            timeout: 30000
        });
        return response.data;
    } catch (error) {
        console.error(`[API] Error:`, error.message);
        throw error;
    }
}

export const descargarTikTok = (url) => apiRequest('/tiktok', { url });
export const descargarYouTubeVideo = (query) => apiRequest('/ytmp4', { url: query });
export const descargarYouTubeAudio = (query) => apiRequest('/ytmp3', { url: query });
export const buscarYouTube = (query) => apiRequest('/yts', { query });
export const descargarPinterest = (url) => apiRequest('/pinterest', { url });
export const buscarWaifu = () => apiRequest('/waifu');
export const descargarApk = (query) => apiRequest('/apk', { query });
export const obtenerLyrics = (query) => apiRequest('/lyrics', { query });
export const generarQR = (texto) => apiRequest('/qr', { text: texto });
export const acortarURL = (url) => apiRequest('/shorturl', { url });