import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '40',
    slug: 'tod-senecas',
    author: 'seneca',
    title: 'Tod Senecas',
    excerpt: 'Erzwungener Selbstmord nach der Pisonischen Verschwörung',
    historicalDate: '65 n. Chr.',
    historicalYear: 65,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Tod', 'Stoa'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `[Posthum rekonstruiert] Der Bote des Kaisers ist eingetroffen. Das Urteil ist der Tod. Ich nehme ihn an wie einen alten Freund. Der Weise fürchtet den Tod nicht, denn er ist Teil der Natur. Ich öffne mir die Pulsadern und diskutiere mit meinen Freunden über die Unsterblichkeit der Seele. Ein passendes Ende für einen Philosophen.`,
      scientific: `Im Jahr 65 n. Chr. wurde Seneca der Beteiligung an der Pisonischen Verschwörung gegen Nero bezichtigt und zum Selbstmord gezwungen. Sein Tod, den Tacitus in seinen 'Annalen' ausführlich beschreibt, wurde als stoisches Ideal eines würdevollen und furchtlosen Sterbens inszeniert.`
    }
  };

export default post;
