import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '5',
    slug: 'de-republica',
    title: 'Über den Staat',
    latinTitle: 'De Re Publica',
    excerpt: 'Gedanken über die ideale Staatsform.',
    date: '2024-02-01',
    historicalDate: 'ca. 54-51 v. Chr.',
    historicalYear: -54,
    author: 'cicero',
    tags: ['Philosophie', 'Politik'],
    readingTime: 9,
    coverImage: '/images/post-republica.jpg',
    content: {
      diary: `Ein ruhiger Abend auf meinem Landgut in Tusculum.

Ich arbeite an **De Re Publica**. Inspiriert von Platon, aber römisch im Geist.

Was ist die beste Staatsform? Nur die Mischverfassung vereint die Vorzüge aller drei.

*Philosophia dux vitae,*
*Cicero*`,
      scientific: `## De Re Publica (54-51 v. Chr.)

Ein philosophischer Dialog in sechs Büchern über die beste Staatsform.

### Kernthese
Die gemischte Verfassung (Monarchie + Aristokratie + Demokratie) ist allen reinen Formen überlegen.

**Quellen:** Cicero, *De Re Publica*; Platon, *Politeia*`,
    },
  };

export default post;
