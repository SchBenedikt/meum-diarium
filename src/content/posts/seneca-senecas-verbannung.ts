import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '36',
    slug: 'senecas-verbannung',
    author: 'seneca',
    title: 'Senecas Verbannung',
    excerpt: 'Nach Korsika verbannt durch Claudius',
    historicalDate: '41 n. Chr.',
    historicalYear: 41,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Exil', 'Philosophie'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Rom hat mich verstoßen. Auf dieser rauen Insel Korsika habe ich nur noch meine Gedanken. Aber ist nicht der Weise autark? Ist nicht das innere Exil schlimmer als das äußere? Ich werde diese Zeit nutzen, um zu schreiben und zu reflektieren. Die Philosophie ist mein einziges Vaterland.`,
      scientific: `Im Jahr 41 n. Chr. wurde Seneca auf Betreiben von Messalina, der Frau des Kaisers Claudius, der Mittäterschaft am Ehebruch mit Iulia Livilla, der Schwester Caligulas, beschuldigt und nach Korsika verbannt. Während seines achtjährigen Exils verfasste er mehrere philosophische Schriften, darunter 'De Consolatione ad Helviam'.`
    }
  };

export default post;
