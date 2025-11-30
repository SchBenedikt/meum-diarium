import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '21',
    slug: 'catilinarische-verschworung',
    author: 'cicero',
    title: 'Catilinarische Verschwörung',
    excerpt: 'Cicero deckt die Verschwörung auf und rettet die Republik',
    historicalDate: '63 v. Chr.',
    historicalYear: -63,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Verschwörung', 'Republik'],
    coverImage: '/images/post-catiline.jpg',
    content: {
      diary: `Rom stand am Abgrund. Catilina und seine Verschwörer planten, die Stadt in Brand zu stecken und die Macht an sich zu reißen. Als Konsul war es meine Pflicht, zu handeln. Mit meiner Rede 'Quo usque tandem...' habe ich ihn im Senat entlarvt. Die Republik ist vorerst gerettet.`,
      scientific: `Als Konsul im Jahr 63 v. Chr. deckte Cicero die Verschwörung des Lucius Sergius Catilina auf. Seine entschiedenen Maßnahmen, einschließlich der Hinrichtung der Verschwörer ohne ordentliches Verfahren, brachten ihm den Ehrentitel 'Pater Patriae' (Vater des Vaterlandes) ein, führten aber später zu seinem eigenen Exil.`
    }
  };

export default post;
