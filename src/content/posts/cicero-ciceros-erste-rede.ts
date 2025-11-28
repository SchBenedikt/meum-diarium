import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '17',
    slug: 'ciceros-erste-rede',
    author: 'cicero',
    title: 'Ciceros erste Rede',
    excerpt: 'Pro Quinctio – Ciceros erste erhaltene Rede',
    historicalDate: '81 v. Chr.',
    historicalYear: -81,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Rhetorik', 'Recht'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Heute habe ich zum ersten Mal meine Stimme für das Recht erhoben. Die Verteidigung von Publius Quinctius war eine Herausforderung, aber mein Plädoyer stand fest. Die Macht des Wortes ist eine Waffe, die ich zu führen lerne.`,
      scientific: `Ciceros Rede 'Pro Quinctio' aus dem Jahr 81 v. Chr. ist seine früheste erhaltene Gerichtsrede. Sie zeigt bereits das rhetorische Talent, das ihn zu Roms größtem Redner machen sollte.`
    }
  };

export default post;
