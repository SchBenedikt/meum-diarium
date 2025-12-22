import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: 'forum-iulium-und-infrastruktur',
  slug: 'forum-iulium-und-infrastruktur',
  author: 'caesar',
  title: 'Forum Iulium',
  latinTitle: 'Forum Iulium et Opera Publica',
  excerpt: 'Warum ich baute: Entlastung des alten Forums, Sichtbarkeit staatlicher Autorität, Arbeitsplätze und Prestige für Rom.',
  historicalDate: '46 v. Chr.',
  historicalYear: -46,
  date: new Date().toISOString().split('T')[0],
  readingTime: 8,
  tags: ['Reform','Stadtplanung','Infrastruktur','Forum'],
  coverImage: '/images/caesar-hero.jpg',
  content: {
    diary: `Rom war zu eng für Rom. Das alte Forum erstickte in seiner eigenen Geschichte. Ich schuf Raum: Das Forum Iulium, geordnet, klar, ein öffentliches Herz, das den Rhythmus der Stadt sichtbar machte.

Straßen, Bauten, Tempel – die Stadt ist nicht nur Kulisse, sie ist Teil der Politik. Wer Ordnung sehen will, muss sie auch sehen können.`,
    scientific: `Caesars Baupolitik kulminiert im Forum Iulium. Ziel: Entlastung des überfüllten Forum Romanum, räumliche Strukturierung von Gericht, Politik und Markt.

## Funktionen des Forum Iulium

- **Räumliche Entzerrung**: neue Flächen für Gerichte und öffentliche Geschäfte.
- **Symbolische Ordnung**: Sichtbarkeit der neuen Machtbalance.
- **Ökonomischer Impuls**: Beschäftigung und städtische Infrastrukturverbesserung.

## Infrastruktur darüber hinaus

- **Straßensanierungen** und **öffentliche Bauten**; Sichtbarkeit staatlicher Autorität schafft Vertrauen und Routine.

Die Baupolitik war nicht bloß Prestige. Sie war Verwaltungsreform in Stein: klare Wege, klare Räume, klare Abläufe.`,
  },
  translations: {
    en: { title: '', excerpt: '', content: { diary: '', scientific: '' } },
    la: { title: '', excerpt: '', content: { diary: '', scientific: '' } },
  },
};

export default post;
