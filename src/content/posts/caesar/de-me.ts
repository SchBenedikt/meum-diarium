import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '26',
    slug: 'de-me',
    author: 'caesar',
    title: 'Schlacht bei Alesia',
    excerpt: 'Vercingetorix kapituliert – Ende des gallischen Widerstands',
    historicalDate: '52 v. Chr.',
    historicalYear: -52,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Belagerung', 'Sieg'],
    coverImage: 'https://www.walksinsiderome.com/uploads/2022/09/Julius-Caesar-1024x576-1.jpg',
    content: {
      diary: `Die Falle ist zugeschnappt. Vercingetorix und seine Hauptstreitmacht sind in Alesia eingeschlossen. Wir haben einen doppelten Belagerungsring errichtet - einen nach innen, einen nach außen. Die gallische Entsatzarmee ist riesig, aber sie wird an unseren Befestigungen zerschellen. Geduld und Disziplin werden uns den Sieg bringen.`,
      scientific: `Die Belagerung von Alesia im Jahr 52 v. Chr. war die entscheidende Schlacht des Gallischen Krieges. Caesars geniale Taktik, einen doppelten Belagerungsring zu bauen, ermöglichte es ihm, die eingeschlossenen Gallier unter Vercingetorix und eine zahlenmäßig weit überlegene gallische Entsatzarmee gleichzeitig zu besiegen. Vercingetorix' Kapitulation besiegelte das Schicksal Galliens.`
    }
  };

export default post;
