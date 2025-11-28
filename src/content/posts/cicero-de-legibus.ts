import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '41',
    slug: 'de-legibus',
    author: 'cicero',
    title: 'De Legibus',
    excerpt: 'Ciceros Werk über die Gesetze',
    historicalDate: '51 v. Chr.',
    historicalYear: -51,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Recht', 'Philosophie'],
    coverImage: '/images/post-republica.jpg',
    content: {
      diary: `Nach dem Staat ('De Re Publica') müssen die Gesetze ('De Legibus') folgen. Ein gerechter Staat braucht gerechte Gesetze, die im Naturrecht und in der göttlichen Vernunft gründen. Ich versuche, die Prinzipien der griechischen Philosophie auf das römische Recht anzuwenden.`,
      scientific: `'De Legibus' ('Über die Gesetze') ist ein philosophischer Dialog von Cicero, der als Ergänzung zu 'De Re Publica' konzipiert wurde. Darin entwickelt er die Idee eines Naturrechts, das allem positiven Recht übergeordnet ist und auf der universellen Vernunft basiert.`
    }
  };

export default post;
