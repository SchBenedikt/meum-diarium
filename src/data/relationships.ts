// Historical relationships between Roman personalities
export interface Relationship {
  source: string;
  target: string;
  type: 'ally' | 'enemy' | 'family' | 'mentor' | 'political' | 'friend';
  description: string;
  strength: number; // 1-5, how strong the connection is
}

export const relationships: Relationship[] = [
  // Caesar relationships
  {
    source: 'caesar',
    target: 'cicero',
    type: 'political',
    description: 'Politische Rivalen, aber zeitweise Verbündete',
    strength: 3
  },
  {
    source: 'caesar',
    target: 'augustus',
    type: 'family',
    description: 'Großonkel und Adoptivvater',
    strength: 5
  },
  {
    source: 'caesar',
    target: 'catilina',
    type: 'political',
    description: 'Politische Beziehung während der Catilinarischen Verschwörung',
    strength: 2
  },

  // Cicero relationships
  {
    source: 'cicero',
    target: 'catilina',
    type: 'enemy',
    description: 'Erbitterter Gegner während der Catilinarischen Verschwörung',
    strength: 5
  },
  {
    source: 'cicero',
    target: 'augustus',
    type: 'political',
    description: 'Unterstützte den jungen Octavian zunächst gegen Marcus Antonius',
    strength: 3
  },

  // Augustus relationships
  {
    source: 'augustus',
    target: 'seneca',
    type: 'political',
    description: 'Seneca lebte unter Augustus\' Nachfolgern',
    strength: 1
  }
];

export interface PersonNode {
  id: string;
  name: string;
  latinName: string;
  years: string;
  color: string;
  description: string;
}

export const personNodes: PersonNode[] = [
  {
    id: 'caesar',
    name: 'Julius Caesar',
    latinName: 'C. Iulius Caesar',
    years: '100–44 v. Chr.',
    color: '#B91C1C',
    description: 'Dictator perpetuo'
  },
  {
    id: 'cicero',
    name: 'Cicero',
    latinName: 'M. Tullius Cicero',
    years: '106–43 v. Chr.',
    color: '#1D4ED8',
    description: 'Consul, Orator, Philosophus'
  },
  {
    id: 'augustus',
    name: 'Augustus',
    latinName: 'C. Octavius Augustus',
    years: '63 v. Chr. – 14 n. Chr.',
    color: '#B45309',
    description: 'Princeps, Erster Kaiser Roms'
  },
  {
    id: 'seneca',
    name: 'Seneca',
    latinName: 'L. Annaeus Seneca',
    years: '4 v. Chr. – 65 n. Chr.',
    color: '#065F46',
    description: 'Philosophus Stoicus'
  },
  {
    id: 'catilina',
    name: 'Catilina',
    latinName: 'L. Sergius Catilina',
    years: '108–62 v. Chr.',
    color: '#7C2D12',
    description: 'Verschwörer'
  }
];
