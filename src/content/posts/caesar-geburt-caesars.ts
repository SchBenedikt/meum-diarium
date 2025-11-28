import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '14',
    slug: 'geburt-caesars',
    author: 'caesar',
    title: 'Geburt Caesars',
    excerpt: 'Gaius Iulius Caesar wird in Rom geboren',
    historicalDate: '100 v. Chr.',
    historicalYear: -100,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Geburt', 'Caesar'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Rom hat einen neuen Sohn. Im Jahr 100 v. Chr. wurde ich, Gaius Iulius Caesar, geboren. Das Schicksal ruft.`,
      scientific: `Gaius Iulius Caesar wurde im Juli des Jahres 100 v. Chr. in Rom geboren. Seine Geburt in die gens Iulia, eine der ältesten Patrizierfamilien Roms, legte den Grundstein für seine außergewöhnliche Laufbahn.`
    }
  };

export default post;
