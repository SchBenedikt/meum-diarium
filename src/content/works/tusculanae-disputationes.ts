import { Work } from '@/types/blog';

const work: Work = {
    title: 'Tusculanae Disputationes',
    author: 'cicero',
    year: '45 v. Chr.',
    summary: 'Eine Reihe von fünf philosophischen Dialogen, die Cicero in seinem Landgut in Tusculum führt. Das Werk befasst sich mit den Voraussetzungen für ein glückliches Leben und wie man mit den großen Übeln der menschlichen Existenz umgeht: der Furcht vor dem Tod, dem Schmerz, der Trauer und den Leidenschaften.',
    takeaway: 'Tugend allein ist ausreichend für ein glückliches Leben. Die Philosophie ist die beste Medizin für die Seele.',
    structure: [
      { title: 'Buch 1', content: 'Über die Verachtung des Todes.' },
      { title: 'Buch 2', content: 'Über die Erträglichkeit des Schmerzes.' },
      { title: 'Buch 3', content: 'Über die Linderung der Trauer.' },
      { title: 'Buch 4', content: 'Über die übrigen seelischen Affekte.' },
      { title: 'Buch 5', content: 'Über die Tugend als Garantin des glücklichen Lebens.' },
    ],
  };

export default work;
