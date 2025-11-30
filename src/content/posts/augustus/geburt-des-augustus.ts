import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '15',
    slug: 'geburt-des-augustus',
    author: 'augustus',
    title: 'Geburt des Augustus',
    excerpt: 'Als Gaius Octavius in Rom geboren',
    historicalDate: '63 v. Chr.',
    historicalYear: -63,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Geburt', 'Augustus'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Mein Leben begann bescheiden. Geboren als Gaius Octavius in Rom im Jahr 63 v. Chr., konnte niemand ahnen, welchen Weg die Götter für mich vorsehen würden.`,
      scientific: `Augustus wurde am 23. September 63 v. Chr. als Gaius Octavius in Rom geboren. Seine spätere Adoption durch seinen Großonkel Gaius Iulius Caesar sollte den Lauf der Geschichte verändern.`
    }
  };

export default post;
