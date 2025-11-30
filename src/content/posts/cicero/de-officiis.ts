import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '43',
    slug: 'de-officiis',
    author: 'cicero',
    title: 'De Officiis',
    excerpt: 'Ciceros Werk über die Pflichten',
    historicalDate: '44 v. Chr.',
    historicalYear: -44,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Ethik', 'Philosophie'],
    coverImage: '/images/post-republica.jpg',
    content: {
      diary: `In diesen unsicheren Zeiten nach Caesars Tod schreibe ich für meinen Sohn Marcus über die Pflichten. Was ist ehrenhaft? Was ist nützlich? Und was, wenn beides im Konflikt steht? Es ist mein philosophisches Testament, ein Leitfaden für ein moralisch richtiges Leben als römischer Bürger.`,
      scientific: `'De Officiis' ('Über die Pflichten') ist Ciceros letztes großes philosophisches Werk, verfasst 44 v. Chr. als Brief an seinen Sohn. Es behandelt die praktische Ethik und den vermeintlichen Konflikt zwischen moralisch Richtigem (honestum) und Nützlichem (utile). Es war eines der einflussreichsten philosophischen Werke in der westlichen Geschichte.`
    }
  };

export default post;
