import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '27',
    slug: 'schlacht-bei-pharsalos',
    author: 'caesar',
    title: 'Schlacht bei Pharsalos',
    excerpt: 'Caesar besiegt Pompeius entscheidend',
    historicalDate: '48 v. Chr.',
    historicalYear: -48,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Bürgerkrieg', 'Pompeius'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Heute hat sich das Schicksal Roms entschieden. Pompeius' Armee war zahlenmäßig überlegen, doch meine Veteranen sind unbesiegbar. Mit einer versteckten vierten Reihe Infanterie habe ich seine Kavallerie zerschlagen. Der große Pompeius floh vom Schlachtfeld. Der Sieg ist mein.`,
      scientific: `Die Schlacht bei Pharsalos am 9. August 48 v. Chr. in Thessalien war die entscheidende Auseinandersetzung im Bürgerkrieg zwischen Caesar und Pompeius. Trotz numerischer Unterlegenheit errang Caesar aufgrund seiner überlegenen Taktik und der Erfahrung seiner Legionen einen vernichtenden Sieg. Pompeius floh nach Ägypten, wo er ermordet wurde.`
    }
  };

export default post;
