import axios from 'axios';

// ══════════════════════════════════════════
//           APIs PÚBLICAS GRATUITAS
// ══════════════════════════════════════════

const TIKTOK_API = 'https://www.tikwm.com/api/?url=';
const YOUTUBE_API = 'https://api.alyachan.dev/api';
const LYRICS_API = 'https://api.lyrics.ovh/v1';
const SHORTURL_API = 'https://is.gd/create.php?format=json&url=';

// ──────────── TIKTOK ────────────
export async function descargarTikTok(url) {
    try {
        const res = await axios.get(TIKTOK_API + encodeURIComponent(url), { timeout: 30000 });
        const data = res.data?.data;
        return {
            titulo: data?.title || 'TikTok',
            video: data?.play || data?.wmplay,
            audio: data?.music,
            thumbnail: data?.cover,
            autor: data?.author?.nickname || data?.author?.unique_id
        };
    } catch (error) {
        throw new Error('Error descargando TikTok');
    }
}

// ──────────── YOUTUBE VIDEO ────────────
export async function descargarYouTubeVideo(query) {
    try {
        const res = await axios.get(`${YOUTUBE_API}/ytmp4?url=${encodeURIComponent(query)}`, { timeout: 60000 });
        const data = res.data;
        return {
            titulo: data?.result?.title || data?.title || 'Video',
            video: data?.result?.downloadUrl || data?.result?.url || data?.url,
            thumbnail: data?.result?.thumbnail || data?.thumbnail
        };
    } catch (error) {
        throw new Error('Error descargando video de YouTube');
    }
}

// ──────────── YOUTUBE AUDIO ────────────
export async function descargarYouTubeAudio(query) {
    try {
        const res = await axios.get(`${YOUTUBE_API}/ytmp3?url=${encodeURIComponent(query)}`, { timeout: 60000 });
        const data = res.data;
        return {
            titulo: data?.result?.title || data?.title || 'Audio',
            audio: data?.result?.downloadUrl || data?.result?.url || data?.url,
            thumbnail: data?.result?.thumbnail || data?.thumbnail
        };
    } catch (error) {
        throw new Error('Error descargando audio de YouTube');
    }
}

// ──────────── BÚSQUEDA YOUTUBE ────────────
export async function buscarYouTube(query) {
    try {
        const res = await axios.get(`https://api.alyachan.dev/api/yts?q=${encodeURIComponent(query)}`, { timeout: 30000 });
        return res.data?.result || res.data?.data || [];
    } catch (error) {
        throw new Error('Error buscando en YouTube');
    }
}

// ──────────── PINTEREST ────────────
export async function descargarPinterest(url) {
    try {
        const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, { timeout: 30000 });
        const data = res.data?.data;
        return {
            imagen: data?.play || data?.cover,
            titulo: data?.title || 'Pinterest'
        };
    } catch (error) {
        throw new Error('Error descargando de Pinterest');
    }
}

// ──────────── APK ────────────
export async function buscarApk(nombre) {
    try {
        const res = await axios.get(`https://apkpure.com/api/v1/search?q=${encodeURIComponent(nombre)}`, { timeout: 30000 });
        return res.data?.results || [];
    } catch (error) {
        throw new Error('Error buscando APK');
    }
}

// ──────────── LYRICS ────────────
export async function obtenerLyrics(cancion) {
    try {
        const res = await axios.get(`${LYRICS_API}/${encodeURIComponent(cancion)}`, { timeout: 30000 });
        return res.data?.lyrics || 'Letra no encontrada';
    } catch (error) {
        throw new Error('Error buscando letra');
    }
}

// ──────────── ACORTAR URL ────────────
export async function acortarURL(url) {
    try {
        const res = await axios.get(SHORTURL_API + encodeURIComponent(url), { timeout: 30000 });
        return res.data?.shorturl || res.data;
    } catch (error) {
        throw new Error('Error acortando URL');
    }
}

// ──────────── WAIFU ────────────
export async function buscarWaifu() {
    try {
        const res = await axios.get('https://api.waifu.pics/sfw/waifu', { timeout: 30000 });
        return res.data?.url;
    } catch (error) {
        throw new Error('Error buscando waifu');
    }
}