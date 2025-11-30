import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '24',
    slug: 'caesar-uberquert-den-rhein',
    author: 'caesar',
    title: 'Caesar überquert den Rhein',
    excerpt: 'Erste römische Rheinüberquerung',
    historicalDate: '55 v. Chr.',
    historicalYear: -55,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Militär', 'Ingenieurskunst'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Die Germanen denken, der Rhein schütze sie. Eine Fehleinschätzung. In nur zehn Tagen haben meine Legionäre eine Brücke über den mächtigen Fluss geschlagen. Eine Demonstration römischer Macht und Ingenieurskunst. Wir betreten germanischen Boden nicht als Eindringlinge, sondern als Herren.`,
      scientific: `Im Jahr 55 v. Chr. ließ Caesar eine Holzbrücke über den Rhein bauen, um germanische Stämme, die die Gallier unterstützten, abzuschrecken. Die Brücke, ein Meisterwerk der römischen Militärtechnik, wurde in nur zehn Tagen errichtet. Nach einer kurzen Machtdemonstration auf der anderen Rheinseite zog sich Caesar zurück und ließ die Brücke wieder abreißen.`
    }
  };

export default post;
