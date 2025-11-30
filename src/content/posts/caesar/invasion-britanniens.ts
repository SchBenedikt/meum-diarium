import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '25',
    slug: 'invasion-britanniens',
    author: 'caesar',
    title: 'Invasion Britanniens',
    excerpt: 'Caesar landet in Britannien',
    historicalDate: '54 v. Chr.',
    historicalYear: -54,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Entdeckung', 'Britannien'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Eine neue Welt am Rande der bekannten Karte. Heute haben wir den Ozean überquert und sind in Britannien gelandet. Die Einheimischen kämpfen wild, aber unsere Disziplin wird siegen. Dies ist mehr als eine Eroberung, es ist eine Erweiterung des römischen Horizonts.`,
      scientific: `Caesar unternahm zwei Expeditionen nach Britannien (55 und 54 v. Chr.). Obwohl sie keine dauerhafte Eroberung zur Folge hatten, waren sie aus römischer Sicht ein großer Prestigegewinn. Er war der erste Römer, der den Ärmelkanal überquerte und militärische Operationen auf der Insel durchführte, was in Rom für großes Aufsehen sorgte.`
    }
  };

export default post;
