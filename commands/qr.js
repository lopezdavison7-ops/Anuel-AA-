import { generarQR } from '../lib/api.js';

export default {
    nombre: 'qr',
    alias: ['qrcode'],
    categoria: 'HERRAMIENTAS',

    ejecutar: async ({ argumento, responder }) => {
        if (!argumento) return responder.texto('❌ Escribe el texto para el QR');
        try {
            const res = await generarQR(argumento);
            await responder.texto(`✅ QR generado\n🔗 ${res.url || res.link}`);
        } catch {
            await responder.texto('❌ Error al generar QR');
        }
    }
};