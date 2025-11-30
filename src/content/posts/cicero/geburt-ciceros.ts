import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '13',
    slug: 'geburt-ciceros',
    author: 'cicero',
    title: 'Geburt Ciceros',
    excerpt: 'Marcus Tullius Cicero wird in Arpinum geboren',
    historicalDate: '106 v. Chr.',
    historicalYear: -106,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Geburt', 'Cicero'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Ein neuer Anfang. Heute, im Jahr 106 v. Chr. vor unserer Zeitrechnung, wurde ich, Marcus Tullius Cicero, in Arpinum geboren. Die Welt erwartet meine Worte.`,
      scientific: `Die Geburt von Marcus Tullius Cicero im Jahr 106 v. Chr. in Arpinum markiert den Beginn eines Lebens, das die römische Republik und die lateinische Sprache nachhaltig prägen sollte.`
    }
  };

export default post;
