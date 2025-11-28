import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '44',
    slug: 'de-clementia',
    author: 'seneca',
    title: 'De Clementia',
    excerpt: 'Senecas Werk über die Milde für Nero',
    historicalDate: '55 n. Chr.',
    historicalYear: 55,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Politik', 'Philosophie'],
    coverImage: '/images/post-nero.jpg',
    content: {
      diary: `Ich habe für den jungen Kaiser eine Schrift über die Milde ('De Clementia') verfasst. Ein Herrscher gewinnt mehr durch Vergebung als durch Grausamkeit. Milde ist das wahre Zeichen von Stärke, nicht von Schwäche. Ich hoffe, er nimmt sich meine Worte zu Herzen.`,
      scientific: `Die Schrift 'De Clementia' ('Über die Milde') verfasste Seneca in den ersten Jahren von Neros Herrschaft (ca. 55/56 n. Chr.). Sie ist als Fürstenspiegel konzipiert und sollte den jungen Kaiser zu einer milden und gerechten Regierung anleiten, die auf der Zustimmung der Untertanen beruht.`
    }
  };

export default post;
