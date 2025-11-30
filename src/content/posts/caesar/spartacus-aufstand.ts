import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '19',
    slug: 'spartacus-aufstand',
    author: 'caesar',
    title: 'Spartacus-Aufstand',
    excerpt: 'Der größte Sklavenaufstand beginnt',
    historicalDate: '73 v. Chr.',
    historicalYear: -73,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Aufstand', 'Sklaven'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Unruhen im Süden. Ein Gladiator namens Spartacus hat eine Revolte angezettelt. Die Republik unterschätzt diese Gefahr. Ein Funke kann ein Feuer entfachen, das ganz Italien erfasst. Ich beobachte die Situation mit Argusaugen.`,
      scientific: `Der von Spartacus angeführte Sklavenaufstand (73–71 v. Chr.) war der größte und gefährlichste seiner Art in der römischen Geschichte. Er erschütterte die Republik in ihren Grundfesten und wurde erst nach Jahren unter enormem militärischen Aufwand niedergeschlagen.`
    }
  };

export default post;
