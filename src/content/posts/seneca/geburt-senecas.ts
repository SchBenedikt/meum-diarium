import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '16',
    slug: 'geburt-senecas',
    author: 'seneca',
    title: 'Geburt Senecas',
    excerpt: 'Lucius Annaeus Seneca wird in Córdoba geboren',
    historicalDate: '4 v. Chr.',
    historicalYear: -4,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Geburt', 'Seneca'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `In der Ferne, in Hispania, begann meine Reise. Um das Jahr 4 v. Chr. wurde ich, Lucius Annaeus Seneca, in Córdoba geboren, um die Lehren der Stoa nach Rom zu tragen.`,
      scientific: `Lucius Annaeus Seneca, bekannt als Seneca der Jüngere, wurde um das Jahr 4 v. Chr. in Córdoba, Hispania, geboren. Er wurde zu einem der führenden Intellektuellen seiner Zeit.`
    }
  };

export default post;
