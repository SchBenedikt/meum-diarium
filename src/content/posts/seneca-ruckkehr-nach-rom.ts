import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '37',
    slug: 'ruckkehr-nach-rom',
    author: 'seneca',
    title: 'Rückkehr nach Rom',
    excerpt: 'Seneca wird aus der Verbannung zurückgerufen',
    historicalDate: '49 n. Chr.',
    historicalYear: 49,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Politik', 'Nero'],
    coverImage: '/images/post-nero.jpg',
    content: {
      diary: `Die Verbannung ist zu Ende. Agrippina, die neue Frau des Claudius, hat meine Rückkehr erwirkt. Ich soll Erzieher ihres Sohnes werden, des jungen Nero. Eine heikle Aufgabe. Kann ich einen zukünftigen Herrscher nach den Prinzipien der Stoa formen? Es ist eine Pflicht, die ich nicht ablehnen kann.`,
      scientific: `Auf Betreiben von Agrippina der Jüngeren wurde Seneca 49 n. Chr. aus der Verbannung zurückgerufen, um als Erzieher des jungen Nero zu fungieren. Nach Neros Thronbesteigung im Jahr 54 wurde Seneca zu einem seiner wichtigsten Berater und prägte die ersten, als positiv bewerteten Jahre von Neros Herrschaft.`
    }
  };

export default post;
