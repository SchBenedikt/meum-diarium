import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '35',
    slug: 'tod-des-augustus',
    author: 'augustus',
    title: 'Tod des Augustus',
    excerpt: 'Augustus stirbt in Nola',
    historicalDate: '14 n. Chr.',
    historicalYear: 14,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Tod', 'Vermächtnis'],
    coverImage: '/images/post-res-gestae.jpg',
    content: {
      diary: `[Posthum rekonstruiert] Meine Zeit ist gekommen. Ich habe die Rolle meines Lebens gut gespielt. "Acta est fabula, plaudite!" - Das Stück ist aus, applaudiert! Ich hinterlasse ein stabiles Reich. Tiberius wird mein Werk fortsetzen. Ich habe Rom als Stadt aus Ziegeln vorgefunden und hinterlasse sie aus Marmor.`,
      scientific: `Augustus starb am 19. August 14 n. Chr. in Nola. Seine Herrschaft dauerte über 40 Jahre und legte den Grundstein für die nächsten zwei Jahrhunderte des Römischen Reiches. Er wurde zum Gott erhoben und im Augustusmausoleum in Rom beigesetzt.`
    }
  };

export default post;
