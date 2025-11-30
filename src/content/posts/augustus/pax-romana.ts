import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '9',
    slug: 'pax-romana',
    title: 'Der Augusteische Frieden',
    latinTitle: 'Pax Romana',
    excerpt: 'Zwei Jahrhunderte Frieden beginnen.',
    date: '2024-03-01',
    historicalDate: '27 v. Chr.',
    historicalYear: -27,
    author: 'augustus',
    tags: ['Frieden', 'Prinzipat'],
    readingTime: 6,
    coverImage: '/images/post-pax-romana.jpg',
    content: {
      diary: `Der Senat hat mir den Titel "Augustus" verliehen. Ich bin nun der Erste unter Gleichen – nicht mehr, nicht weniger.

Die Tore des Janus-Tempels sind geschlossen. Zum ersten Mal seit Generationen herrscht Frieden im gesamten Reich.`,
      scientific: `## Pax Romana (27 v. Chr. – 180 n. Chr.)

Eine etwa 200 Jahre währende Periode relativen Friedens im Römischen Reich.

### Merkmale
- Keine größeren Bürgerkriege
- Wirtschaftlicher Aufschwung
- Kulturelle Blüte

**Quellen:** Tacitus, *Annales*; Cassius Dio`,
    },
  };

export default post;
