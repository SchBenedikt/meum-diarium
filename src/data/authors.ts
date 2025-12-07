import { AuthorInfo } from '@/types/blog';

export const authors: Record<string, AuthorInfo> = {
  caesar: {
    id: 'caesar',
    name: 'Gaius Julius Caesar',
    latinName: 'Gaius Iulius Caesar',
    title: 'Dictator Perpetuo',
    years: '100 – 44 v. Chr.',
    birthYear: -100,
    deathYear: -44,
    description: 'Feldherr, Staatsmann und Autor. Eroberer Galliens und Begründer des Übergangs von der Römischen Republik zum Kaiserreich.',
    heroImage: '/images/caesar-hero.jpg',
    theme: 'theme-caesar',
    color: 'hsl(25, 95%, 53%)',
  },
};
