import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '18',
    slug: 'caesar-wird-gefangen',
    author: 'caesar',
    title: 'Caesar wird gefangen',
    excerpt: 'Von Piraten entführt und freigekauft',
    historicalDate: '75 v. Chr.',
    historicalYear: -75,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Abenteuer', 'Piraten'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Eine unerwartete Wendung auf meiner Reise. Piraten! Sie dachten, sie hätten einen einfachen Fang gemacht. Sie forderten 20 Talente, ich lachte und sagte ihnen, ich sei mindestens 50 wert. Während der Gefangenschaft schrieb ich Reden und Gedichte, die ich ihnen vortrug. Sie werden für ihre Frechheit bezahlen.`,
      scientific: `Auf seiner Reise nach Rhodos wurde der junge Caesar 75 v. Chr. von kilikischen Piraten gefangen genommen. Er behielt während seiner Gefangenschaft eine bemerkenswerte Haltung bei und ließ sich nach seiner Freilassung gegen ein Lösegeld von 50 Talenten umgehend an den Piraten kreuzigen.`
    }
  };

export default post;
