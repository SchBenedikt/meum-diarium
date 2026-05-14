import { Work } from '@/types/blog';
const work: Work = {
  title: 'Pro Milone',
  author: 'cicero',
  year: '52 v. Chr.',
  summary: `Pro Milone (Für Milo) ist eine der berühmtesten und umstrittensten Reden Ciceros. Titus Annius Milo wurde angeklagt, seinen Feind Publius Clodius Pulcher getötet zu haben. Cicero verteidigte ihn mit der These: Der Mord war Notwehr – Clodius überfiel Milo, und die Tötung war gerechtfertigt. Die überlieferte Version gilt als Meisterwerk der forensischen Rhetorik.`,
  takeaway: `Der Sieg der Rhetorik über die Rechtslage. Cicero selbst zitterte so sehr bei der tatsächlichen Rede, dass seine Verteidigung scheiterte und Milo verurteilt wurde. Die schriftliche Fassung dagegen ist ein rhetorisches Meisterwerk und gilt als eine der perfektesten Reden der Weltliteratur. Milo soll gesagt haben: "Cicero, hättest du so gesprochen, säße ich nicht hier in Massilia."`,
  structure: [
    {
      title: 'Exordium: Die außergewöhnliche Situation',
      content: `Cicero beginnt mit der Rechtfertigung seiner eigenen Angst: Er verteidige Milo unter Waffen und Drohungen. Die Situation in Rom sei so aufgeheizt, dass er um sein Leben fürchten müsse.`
    },
    {
      title: 'Narratio: Der Hergang des Todes von Clodius',
      content: `Cicero schildert den Tag des Mordes: Milo und Clodius begegneten sich zufällig auf der Via Appia. Clodius' Sklaven überfielen Milos Begleittrupp. Milo wehrte sich in Notwehr. Clodius wurde dabei getötet.`
    },
    {
      title: 'Argumentatio: Notwehr und Staatswohl',
      content: `Drei Argumente: 1) Es war Notwehr – Clodius plante Milo zu ermorden. 2) Der Tod des Clodius nützt dem Staat – er war ein Staatsfeind. 3) Milo handelte im Interesse der res publica. Cicero wendet die Theorie des gerechten Totschlags an.`
    },
    {
      title: 'Peroratio: Der moralische Sieg',
      content: `Ciceros Schluss: Milo mag verbannt werden, aber sein Gewissen ist rein. Er stirbt lieber in Ehren verbannt als in Unehren in Rom. Der Höhepunkt: Milos angebliches Wort, es sei schöner, auf der Stelle des Clodius zu sterben, als über ihn zu triumphieren.`
    }
  ],
  translations: {}
};
export default work;
