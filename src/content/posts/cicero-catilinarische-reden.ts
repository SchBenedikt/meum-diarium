import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '4',
    slug: 'catilinarische-reden',
    title: 'Gegen Catilina',
    latinTitle: 'In Catilinam',
    excerpt: 'Wie lange noch, Catilina, wirst du unsere Geduld missbrauchen?',
    date: '2024-01-25',
    historicalDate: '8. November 63 v. Chr.',
    historicalYear: -63,
    author: 'cicero',
    tags: ['Rede', 'Verschwörung'],
    readingTime: 7,
    coverImage: '/images/post-catiline.jpg',
    content: {
      diary: `Heute war der Tag, an dem ich Rom gerettet habe.

**"Quo usque tandem abutere, Catilina, patientia nostra?"**

Ich sah, wie die Farbe aus seinem Gesicht wich. Er wusste nicht, wie viel ich wusste. Am Ende floh er aus Rom.

*In perpetuum,*
*Marcus Tullius Cicero, Consul*`,
      scientific: `## Die Catilinarischen Reden (63 v. Chr.)

Die vier Reden gegen Lucius Sergius Catilina gehören zu den berühmtesten der römischen Antike.

### Die vier Reden
1. **8. November** – Im Senat
2. **9. November** – Vor dem Volk
3. **3. Dezember** – Nach der Verhaftung
4. **5. Dezember** – Über das Urteil

**Quellen:** Cicero, *In Catilinam I-IV*; Sallust`,
    },
  };

export default post;
