import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '38',
    slug: 'mord-an-agrippina',
    author: 'seneca',
    title: 'Mord an Agrippina',
    excerpt: 'Nero lässt seine Mutter töten',
    historicalDate: '59 n. Chr.',
    historicalYear: 59,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Nero', 'Verbrechen'],
    coverImage: '/images/post-nero.jpg',
    content: {
      diary: `Eine dunkle Stunde für Rom. Der Kaiser hat seine eigene Mutter ermorden lassen. Ich musste eine Rede verfassen, die diese ungeheuerliche Tat vor dem Senat rechtfertigt. Ein schmutziges Geschäft. Der Abgrund, der sich vor Nero auftut, zieht uns alle mit sich.`,
      scientific: `Im Jahr 59 n. Chr. ließ Nero seine Mutter Agrippina die Jüngere ermorden, die er als Bedrohung für seine Macht ansah. Seneca wurde gezwungen, die Tat nachträglich zu rechtfertigen, was seinen eigenen moralischen Kompromiss und seinen schwindenden Einfluss auf den Kaiser offenbarte.`
    }
  };

export default post;
