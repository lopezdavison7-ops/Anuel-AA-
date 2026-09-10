import { apiRequest } from '../lib/api.js';

export default {
    nombre: 'ia',
    alias: ['ai', 'chatgpt', 'gpt'],
    categoria: 'AI',

    ejecutar: async ({ argumento, responder }) => {
        if (!argumento) return responder.texto('❌ Escribe algo. Ejemplo: .ia hola');
        try {
            await responder.texto('🤖 Pensando...');
            const res = await apiRequest('/ai', { prompt: argumento });
            await responder.texto(res.resultado || res.response || 'Sin respuesta');
        } catch {
            await responder.texto('❌ Error al conectar con la IA');
        }
    }
};