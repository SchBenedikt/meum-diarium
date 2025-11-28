import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '42',
    slug: 'tusculanae-disputationes',
    author: 'cicero',
    title: 'Tusculanae Disputationes',
    excerpt: 'Philosophische Gespräche in Tusculum',
    historicalDate: '45 v. Chr.',
    historicalYear: -45,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Philosophie', 'Glück'],
    coverImage: '/images/post-republica.jpg',
    content: {
      diary: `Nach dem Tod meiner geliebten Tochter Tullia finde ich nur in der Philosophie Trost. In meinem Landhaus in Tusculum führe ich Gespräche über die großen Fragen des Lebens: Wie überwindet man Schmerz? Ist der Tod ein Übel? Ist Tugend allein ausreichend für ein glückliches Leben?`,
      scientific: `Die 'Tusculanae Disputationes' ('Gespräche in Tusculum') sind eine fünfbändige philosophische Schrift Ciceros, verfasst 45 v. Chr. Sie behandeln in Dialogform die Bedingungen für ein glückliches Leben und wie man mit Schmerz, Furcht und dem Tod umgeht. Das Werk ist ein zentraler Text zur Vermittlung griechischer Philosophie in Rom.`
    }
  };

export default post;
