import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '22',
    slug: 'erstes-triumvirat',
    author: 'caesar',
    title: 'Erstes Triumvirat',
    excerpt: 'Caesar, Pompeius und Crassus bilden ein Bündnis',
    historicalDate: '60 v. Chr.',
    historicalYear: -60,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Politik', 'Bündnis'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Die Politik in Rom ist ein Minenfeld. Allein kommt man nicht voran. Mit Pompeius und Crassus habe ich eine Übereinkunft getroffen. Ein informelles Bündnis, um die verkrusteten Strukturen des Senats zu umgehen. Gemeinsam sind wir stärker. Dies ist der Weg zur Macht.`,
      scientific: `Das sogenannte Erste Triumvirat war ein informelles politisches Bündnis zwischen Gaius Iulius Caesar, Gnaeus Pompeius Magnus und Marcus Licinius Crassus um 60 v. Chr. Es war kein offizielles Gremium, sondern eine private Absprache, um gegenseitig ihre politischen Ziele gegen den Widerstand der Optimaten im Senat durchzusetzen.`
    }
  };

export default post;
