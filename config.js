// ══════════════════════════════════════════
//          CONFIGURACIÓN GLOBAL
// ══════════════════════════════════════════

export const CONFIG = {
    // ⭐ API KEYS
    ALEX_API_URL: 'https://alex-api-scraper2-1.onrender.com',
    ALEX_API_KEY: 'TU_API_KEY_DE_ALEX_AQUI',
    
    // ⭐ OWNERS (múltiples dueños)
    OWNERS: ['50578391933', '50577455383'],
    
    // Nombre del bot
    BOT_NAME: 'ANUEL AA',
    
    // Prefijo
    PREFIX: '.',
    
    // Puerto
    PORT: 3000
};

// Helper para verificar si es owner
export function esOwner(numero) {
    const limpio = numero.replace(/\D/g, '');
    return CONFIG.OWNERS.some(owner => limpio === owner || limpio === `505${owner}`);
}