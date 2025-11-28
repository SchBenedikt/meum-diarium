import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '34',
    slug: 'varusschlacht',
    author: 'augustus',
    title: 'Varusschlacht',
    excerpt: 'Vernichtende Niederlage der Römer in Germanien',
    historicalDate: '9 n. Chr.',
    historicalYear: 9,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Niederlage', 'Germanien'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Eine schreckliche Nachricht aus Germanien. Drei Legionen, vernichtet. Varus, tot. Ein Verrat durch Arminius, dem ich vertraute. Man sagt, ich schlage meinen Kopf gegen die Wand und rufe: 'Quintilius Varus, gib mir meine Legionen zurück!'. Germanien ist verloren.`,
      scientific: `Die Schlacht im Teutoburger Wald im Jahr 9 n. Chr. war eine vernichtende Niederlage der Römer gegen ein Bündnis germanischer Stämme unter Führung von Arminius. Drei römische Legionen unter Publius Quinctilius Varus wurden vollständig aufgerieben. Diese Niederlage beendete die römischen Expansionsbestrebungen östlich des Rheins.`
    }
  };

export default post;
