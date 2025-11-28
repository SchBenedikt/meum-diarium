import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '10',
    slug: 'briefe-an-lucilius',
    title: 'Briefe an Lucilius',
    latinTitle: 'Epistulae Morales ad Lucilium',
    excerpt: 'Philosophische Weisheiten für das tägliche Leben.',
    date: '2024-03-05',
    historicalDate: '62-65 n. Chr.',
    historicalYear: 63,
    author: 'seneca',
    tags: ['Philosophie', 'Stoizismus'],
    readingTime: 8,
    coverImage: '/images/post-lucilius.jpg',
    content: {
      diary: `Mein lieber Lucilius,

Es ist nicht so, dass wir wenig Zeit hätten, sondern dass wir viel davon verschwenden. **Das Leben ist lang genug, wenn man es weise nutzt.**

Die meisten Menschen klagen über die Kürze des Lebens, während sie ihre Tage mit Nichtigkeiten vergeuden.

*Vale,*
*Seneca*`,
      scientific: `## Epistulae Morales ad Lucilium (62-65 n. Chr.)

124 erhaltene Briefe an Senecas Freund Lucilius.

### Themen
- Umgang mit der Zeit
- Tod und Vergänglichkeit
- Tugendhaftes Leben
- Freundschaft

**Quellen:** Seneca, *Epistulae Morales*`,
    },
  };

export default post;
