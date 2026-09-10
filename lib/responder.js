export function crearResponder(sock, jid, msg) {
    return {
        texto: async (text) => await sock.sendMessage(jid, { text }, { quoted: msg }),
        imagen: async (img, caption = '') => await sock.sendMessage(jid, { image: img, caption }, { quoted: msg }),
        video: async (vid, caption = '') => await sock.sendMessage(jid, { video: vid, caption }, { quoted: msg }),
        audio: async (aud, ptt = false) => await sock.sendMessage(jid, { audio: aud, mimetype: 'audio/mpeg', ptt }, { quoted: msg }),
        sticker: async (sticker) => await sock.sendMessage(jid, { sticker }, { quoted: msg })
    };
}