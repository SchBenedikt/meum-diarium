import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '12',
    slug: 'neros-lehrer',
    title: 'Am Hofe Neros',
    latinTitle: 'In Aula Neronis',
    excerpt: 'Zwischen Philosophie und Politik.',
    date: '2024-03-15',
    historicalDate: '54-62 n. Chr.',
    historicalYear: 55,
    author: 'seneca',
    tags: ['Politik', 'Nero'],
    readingTime: 9,
    coverImage: '/images/post-nero.jpg',
    content: {
      diary: `Acht Jahre lang war ich Neros Berater. Die ersten fünf Jahre – das "Quinquennium Neronis" – waren gut. Der junge Kaiser hörte auf meinen Rat.

Doch dann änderte sich alles. Der Mord an seiner Mutter Agrippina war der Anfang vom Ende.

Ich habe mich zurückgezogen. Die Philosophie ist mein einziger Trost.`,
      scientific: `## Seneca als Berater Neros (54-62 n. Chr.)

### Das Quinquennium Neronis
Die ersten fünf Jahre von Neros Herrschaft gelten als vorbildlich.

### Senecas Rolle
- Erzieher seit Neros Jugend
- Politischer Berater
- Verfasser kaiserlicher Reden

**Quellen:** Tacitus, *Annales*; Cassius Dio`,
    },
  };

export default post;
