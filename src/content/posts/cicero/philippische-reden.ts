import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '6',
    slug: 'philippische-reden',
    title: 'Die Philippischen Reden',
    latinTitle: 'Orationes Philippicae',
    excerpt: 'Mein letzter Kampf gegen die Tyrannei.',
    date: '2024-02-15',
    historicalDate: '44-43 v. Chr.',
    historicalYear: -44,
    author: 'cicero',
    tags: ['Rede', 'Marcus Antonius'],
    readingTime: 8,
    coverImage: '/images/post-philippic.jpg',
    content: {
      diary: `Marcus Antonius ist nicht besser als Catilina. Er strebt nach der Alleinherrschaft!

Ich werde ihn bekämpfen, mit der einzigen Waffe die ich habe: Meine Worte.

Diese Reden werden mein Vermächtnis sein – oder mein Todesurteil.`,
      scientific: `## Die Philippischen Reden (44-43 v. Chr.)

14 Reden gegen Marcus Antonius nach der Ermordung Caesars.

### Folgen
Die Reden führten zu Ciceros Proskription und Tod am 7. Dezember 43 v. Chr.

**Quellen:** Cicero, *Philippicae*`,
    },
  };

export default post;
