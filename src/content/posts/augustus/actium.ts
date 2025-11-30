import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '7',
    slug: 'actium',
    title: 'Die Schlacht bei Actium',
    latinTitle: 'Proelium Actiacum',
    excerpt: 'Der Sieg, der mir die Welt gab.',
    date: '2024-02-20',
    historicalDate: '2. September 31 v. Chr.',
    historicalYear: -31,
    author: 'augustus',
    tags: ['Seeschlacht', 'Bürgerkrieg'],
    readingTime: 7,
    coverImage: '/images/post-actium.jpg',
    content: {
      diary: `Heute habe ich Antonius und Kleopatra besiegt. Die Seeschlacht war entscheidend.

Als ihre Schiffe flohen, wusste ich: Rom gehört mir. Aber ich werde kein Tyrann sein wie mein Adoptivvater.

Ich werde Rom in eine neue Ära führen – eine Ära des Friedens.`,
      scientific: `## Die Schlacht bei Actium (31 v. Chr.)

Die entscheidende Seeschlacht zwischen Octavian und der Flotte von Marcus Antonius und Kleopatra.

### Ergebnis
Octavians Sieg beendete den Bürgerkrieg und führte zur Alleinherrschaft.

**Quellen:** Cassius Dio; Plutarch, *Antonius*`,
    },
  };

export default post;
