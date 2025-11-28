import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '8',
    slug: 'res-gestae',
    title: 'Meine Taten',
    latinTitle: 'Res Gestae Divi Augusti',
    excerpt: 'Ein Rückblick auf mein Lebenswerk.',
    date: '2024-02-25',
    historicalDate: '14 n. Chr.',
    historicalYear: 14,
    author: 'augustus',
    tags: ['Autobiografie', 'Vermächtnis'],
    readingTime: 10,
    coverImage: '/images/post-res-gestae.jpg',
    content: {
      diary: `Im Alter von 19 Jahren habe ich eine Armee aufgestellt. Heute, nach über 50 Jahren, hinterlasse ich ein Reich in Frieden.

**Ich habe Rom aus Ziegeln gefunden und aus Marmor hinterlassen.**

Die Grenzen sind gesichert, die Bürgerkriege beendet. Das ist mein Vermächtnis.`,
      scientific: `## Res Gestae Divi Augusti

Ein Rechenschaftsbericht des Augustus, nach seinem Tod in Bronze eingraviert.

### Inhalt
- Militärische Erfolge
- Bauwerke und Geschenke an das Volk
- Politische Ämter und Ehrungen

**Quellen:** *Monumentum Ancyranum* (erhaltene Kopie in Ankara)`,
    },
  };

export default post;
