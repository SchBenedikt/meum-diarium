import { Work } from '@/types/blog';

const work: Work = {
    title: 'De Bello Civili',
    author: 'caesar',
    year: 'ca. 48-44 v. Chr.',
    summary: 'Caesars Rechtfertigungsschrift über den Bürgerkrieg gegen Gnaeus Pompeius Magnus und die Senatsmehrheit. Das Werk beginnt mit den Ereignissen, die zur Überschreitung des Rubikons führten, und schildert die Feldzüge in Italien, Spanien, und Griechenland bis zur Schlacht von Pharsalos und Pompeius\' Flucht nach Ägypten.',
    takeaway: 'Ich wurde vom Senat und von Pompeius verraten und war gezwungen, zu den Waffen zu greifen, um meine Würde (dignitas) zu verteidigen.',
    structure: [
      { title: 'Buch 1', content: 'Verhandlungen vor dem Krieg, Überschreitung des Rubikons und Feldzug in Italien und Spanien.' },
      { title: 'Buch 2', content: 'Belagerung von Massilia (Marseille) und Kämpfe in Afrika.' },
      { title: 'Buch 3', content: 'Feldzug in Griechenland, die Niederlage bei Dyrrhachium und der entscheidende Sieg bei Pharsalos.' },
    ],
  };

export default work;
