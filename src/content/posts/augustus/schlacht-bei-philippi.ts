import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '31',
    slug: 'schlacht-bei-philippi',
    author: 'augustus',
    title: 'Schlacht bei Philippi',
    excerpt: 'Octavian und Antonius besiegen die Caesarmörder',
    historicalDate: '42 v. Chr.',
    historicalYear: -42,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Rache', 'Bürgerkrieg'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Brutus und Cassius sind besiegt. Der Geist meines Vaters ist gerächt. Die Schlacht war hart, und Antonius hat den größeren Anteil am Sieg. Aber das Ergebnis zählt. Die Mörder Caesars haben ihre gerechte Strafe erhalten. Nun beginnt der Kampf um sein Erbe.`,
      scientific: `Die Schlacht bei Philippi im Oktober 42 v. Chr. war eine entscheidende Auseinandersetzung zwischen den Streitkräften des Zweiten Triumvirats (Octavian und Antonius) und den Caesarmördern (Brutus und Cassius). Der Sieg der Triumvirn festigte ihre Macht über Rom.`
    }
  };

export default post;
