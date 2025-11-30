import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '32',
    slug: 'beginn-des-prinzipats',
    author: 'augustus',
    title: 'Beginn des Prinzipats',
    excerpt: 'Octavian erhält den Titel Augustus',
    historicalDate: '27 v. Chr.',
    historicalYear: -27,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Prinzipat', 'Frieden'],
    coverImage: '/images/post-pax-romana.jpg',
    content: {
      diary: `Heute hat mir der Senat den Ehrentitel 'Augustus', der Erhabene, verliehen. Ich habe die Republik offiziell wiederhergestellt, aber die Macht liegt in meinen Händen. Ich bin der 'Princeps', der Erste Bürger. Dies ist ein neuer Weg für Rom. Kein Königtum, sondern eine Herrschaft, die auf Ansehen und Gesetz beruht.`,
      scientific: `Am 16. Januar 27 v. Chr. verlieh der Senat Octavian den neuen Ehrennamen Augustus. Dieses Datum markiert formal den Beginn des Prinzipats, der römischen Kaiserzeit. Augustus schuf eine neue Staatsordnung, die die Fassade der Republik aufrechterhielt, während die wahre Macht beim Princeps lag.`
    }
  };

export default post;
