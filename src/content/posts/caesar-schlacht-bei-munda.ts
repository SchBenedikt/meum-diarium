import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '29',
    slug: 'schlacht-bei-munda',
    author: 'caesar',
    title: 'Schlacht bei Munda',
    excerpt: 'Caesars letzter militärischer Sieg',
    historicalDate: '45 v. Chr.',
    historicalYear: -45,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Bürgerkrieg', 'Sieg'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Dies war der härteste Kampf meines Lebens. Die Söhne des Pompeius kämpften verbissen. Einen Moment lang dachte ich, alles sei verloren. Ich musste selbst in vorderster Reihe kämpfen, um meine Männer anzuspornen. Am Ende haben wir gesiegt, aber der Preis war hoch. Der Bürgerkrieg ist nun endgültig vorbei.`,
      scientific: `Die Schlacht bei Munda am 17. März 45 v. Chr. in Südspanien war die letzte Schlacht in Caesars Bürgerkrieg. Caesar besiegte die Legionen der Söhne des Pompeius. Der Sieg beendete den Bürgerkrieg und ermöglichte Caesar die Rückkehr nach Rom, wo er seine Macht als Diktator festigte.`
    }
  };

export default post;
