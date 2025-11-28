import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '2',
    slug: 'alesia',
    title: 'Die Belagerung von Alesia',
    latinTitle: 'Obsidio Alesiae',
    excerpt: 'Vercingetorix und das letzte Aufbäumen der gallischen Freiheit.',
    date: '2024-01-20',
    historicalDate: 'September 52 v. Chr.',
    historicalYear: -52,
    author: 'caesar',
    tags: ['Gallischer Krieg', 'Belagerung'],
    readingTime: 10,
    coverImage: '/images/post-alesia.jpg',
    content: {
      diary: `Alesia ist gefallen. Vercingetorix hat sich mir ergeben.

**Aber am Ende siegte römische Ingenieurskunst.** Wir bauten 18 Kilometer Befestigungen um die Festung.

Als Vercingetorix seine Waffen zu meinen Füßen warf, sah ich das Ende eines Kapitels. Gallien gehört nun Rom.

*Veni, vidi, vici* – zumindest hier in Gallien.`,
      scientific: `## Die Belagerung von Alesia (52 v. Chr.)

Die Schlacht um Alesia gilt als militärisches Meisterwerk. Caesars doppelte Belagerungslinie (Circumvallation und Contravallation) verhinderte sowohl den Ausbruch als auch die Entsetzung.

**Truppenstärken:** Römer ca. 60.000, Gallier in Alesia ca. 80.000

**Quellen:** Caesar, *De Bello Gallico*, Buch VII`,
    },
  };

export default post;
