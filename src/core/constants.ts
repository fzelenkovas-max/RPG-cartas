/** Os 9 slots de equipamento (GDD seção 8). */
export const EQUIPMENT_SLOTS = [
  { id: 'weapon', name: 'Arma' },
  { id: 'shield', name: 'Escudo' },
  { id: 'helmet', name: 'Elmo' },
  { id: 'armor', name: 'Armadura' },
  { id: 'legs', name: 'Calça' },
  { id: 'boots', name: 'Bota' },
  { id: 'ring1', name: 'Anel 1' },
  { id: 'ring2', name: 'Anel 2' },
  { id: 'amulet', name: 'Amuleto' },
] as const;

/** Tipos de pista das fases (GDD seção 3). */
export const CLUE_TYPES = [
  { id: 'sword', name: 'Espada', symbol: '⚔' },
  { id: 'eye', name: 'Olho', symbol: '👁' },
  { id: 'key', name: 'Chave', symbol: '🗝' },
  { id: 'skull', name: 'Caveira', symbol: '☠' },
] as const;
