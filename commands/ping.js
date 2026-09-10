export default {
    nombre: 'ping',
    alias: ['velocidad', 'speed'],
    categoria: 'GENERAL',

    ejecutar: async ({ responder }) => {
        const inicio = Date.now();
        await responder.texto('⏳ Midiendo velocidad...');
        const velocidad = Date.now() - inicio;
        
        const diseño = `╭━━━━━━━━━━━━━━╮
┃  🏓 *PONG!*
┃  
┃  ⚡ Velocidad: ${velocidad}ms
┃  🟢 Estado: Online
┃  🎤 Bot: ANUEL AA
╰━━━━━━━━━━━━━━╯`;
        
        await responder.texto(diseño);
    }
};