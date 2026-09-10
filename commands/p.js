export default {
    nombre: 'p',
    alias: [],
    categoria: 'GENERAL',

    ejecutar: async ({ responder }) => {
        const inicio = Date.now();
        const velocidad = Date.now() - inicio;
        
        // Diseño minimalista diferente
        await responder.texto(`⚡ ${velocidad}ms │ 🟢 ANUEL AA`);
    }
};