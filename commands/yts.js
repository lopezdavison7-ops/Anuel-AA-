import { buscarYouTube } from '../lib/api.js';

export default {
    nombre: 'yts',
    alias: ['ytsearch', 'ytsver'],
    categoria: 'SEARCH',

    ejecutar: async ({ argumento, responder }) => {
        if (!argumento) return responder.texto('❌ Escribe qué buscar en YouTube');
        try {
            const res = await buscarYouTube(argumento);
            const resultados = res.resultados || res.results || [];
            
            let texto = `🔍 Resultados para: "${argumento}"\n\n`;
            resultados.slice(0, 5).forEach((r, i) => {
                texto += `${i + 1}. ${r.titulo || r.title}\n🔗 ${r.url}\n\n`;
            });
            
            await responder.texto(texto);
        } catch {
            await responder.texto('❌ Error al buscar');
        }
    }
};