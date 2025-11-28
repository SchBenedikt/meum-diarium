import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '23',
    slug: 'beginn-des-gallischen-krieges',
    author: 'caesar',
    title: 'Beginn des Gallischen Krieges',
    excerpt: 'Caesar beginnt die Eroberung Galliens',
    historicalDate: '58 v. Chr.',
    historicalYear: -58,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Krieg', 'Gallien'],
    coverImage: '/images/post-alesia.jpg',
    content: {
      diary: `Die Helvetier sind unruhig. Ihre Wanderung bedroht unsere Provinz. Ich habe die Brücke bei Genf abreißen lassen. Dies ist die Gelegenheit, auf die ich gewartet habe. Gallien ist ein reiches, aber zerstrittenes Land. Es ist an der Zeit, es unter die Herrschaft Roms zu bringen.`,
      scientific: `Im Jahr 58 v. Chr. nutzte Caesar die Migration der Helvetier als Vorwand, um in Gallien militärisch zu intervenieren. Dies markierte den Beginn des acht Jahre dauernden Gallischen Krieges, der mit der Unterwerfung ganz Galliens endete und Caesars Macht und Reichtum enorm vergrößerte.`
    }
  };

export default post;
