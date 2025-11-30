import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '30',
    slug: 'tod-ciceros',
    author: 'cicero',
    title: 'Tod Ciceros',
    excerpt: 'Proskribiert und auf Befehl des Antonius getötet',
    historicalDate: '43 v. Chr.',
    historicalYear: -43,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Tod', 'Antonius'],
    coverImage: '/images/post-philippic.jpg',
    content: {
      diary: `[Posthum rekonstruiert] Meine Reden gegen Antonius waren mein Todesurteil. Ich habe es gewusst. Als die Häscher kamen, habe ich mein Schicksal akzeptiert. Ich habe für die Republik gelebt, und ich sterbe für sie. Möge Rom eines Tages wieder frei sein. O tempora, o mores!`,
      scientific: `Nach der Bildung des Zweiten Triumvirats wurde Cicero auf Betreiben von Marcus Antonius proskribiert. Er wurde am 7. Dezember 43 v. Chr. auf der Flucht gefasst und getötet. Sein Kopf und seine Hände wurden auf der Rednerbühne in Rom ausgestellt – eine grausame Warnung an alle Feinde des Antonius.`
    }
  };

export default post;
