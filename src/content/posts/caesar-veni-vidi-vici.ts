import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '28',
    slug: 'veni-vidi-vici',
    author: 'caesar',
    title: 'Veni, vidi, vici',
    excerpt: 'Caesars Sieg über Pharnakes II.',
    historicalDate: '47 v. Chr.',
    historicalYear: -47,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Sieg', 'Spruch'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Der Feldzug gegen Pharnakes war kurz und entscheidend. Fünf Tage, eine Schlacht. Meinem Bericht an den Senat habe ich nur drei Worte hinzugefügt: VENI, VIDI, VICI. Ich kam, sah und siegte. Das sagt alles.`,
      scientific: `Nach seinem schnellen Sieg über Pharnakes II. von Pontos in der Schlacht bei Zela im Jahr 47 v. Chr. soll Caesar den berühmten Satz "Veni, vidi, vici" an einen Freund in Rom geschrieben haben. Diese lakonische Siegesbotschaft unterstrich die Effizienz und Geschwindigkeit seiner Kriegsführung.`
    }
  };

export default post;
