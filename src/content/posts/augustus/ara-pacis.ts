import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '33',
    slug: 'ara-pacis',
    author: 'augustus',
    title: 'Ara Pacis',
    excerpt: 'Der Friedensaltar wird geweiht',
    historicalDate: '19 v. Chr.',
    historicalYear: -19,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Frieden', 'Kunst'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Der Senat hat die Weihung des 'Ara Pacis Augustae', des Altars des Augusteischen Friedens, beschlossen. Er soll ein Denkmal für den Frieden sein, den ich Rom nach Jahrzehnten des Bürgerkriegs gebracht habe. Möge er für immer an die Segnungen der Stabilität und des Wohlstands erinnern.`,
      scientific: `Der Ara Pacis Augustae ist ein Altar, der dem Frieden geweiht und zwischen 13 und 9 v. Chr. auf dem Marsfeld in Rom errichtet wurde. Er ist ein Meisterwerk der augusteischen Kunst und ein zentrales Propagandainstrument, das den von Augustus hergestellten Frieden (Pax Augusta) feiert.`
    }
  };

export default post;
