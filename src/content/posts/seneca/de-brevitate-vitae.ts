import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '11',
    slug: 'de-brevitate-vitae',
    title: 'Von der Kürze des Lebens',
    latinTitle: 'De Brevitate Vitae',
    excerpt: 'Das Leben ist lang – wenn man es zu leben versteht.',
    date: '2024-03-10',
    historicalDate: 'ca. 49 n. Chr.',
    historicalYear: 49,
    author: 'seneca',
    tags: ['Philosophie', 'Zeit'],
    readingTime: 7,
    coverImage: '/images/post-brevitate.jpg',
    content: {
      diary: `Die meisten Menschen leben, als hätten sie ewige Zeit. Dabei vergessen sie zu leben.

**Nicht die Jahre zählen, sondern was wir daraus machen.**

Sei kein Sklave der Zukunft und kein Gefangener der Vergangenheit. Lebe jetzt.`,
      scientific: `## De Brevitate Vitae (ca. 49 n. Chr.)

Eine philosophische Abhandlung über den richtigen Umgang mit der Lebenszeit.

### Kerngedanken
- Zeit ist das einzige wahrhaft Kostbare
- Die meisten Menschen verschwenden ihr Leben
- Philosophie als Weg zum erfüllten Leben

**Quellen:** Seneca, *De Brevitate Vitae*`,
    },
  };

export default post;
