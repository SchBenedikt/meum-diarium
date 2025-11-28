import { Work } from '@/types/blog';

const work: Work = {
    title: 'De Legibus',
    author: 'cicero',
    year: 'ca. 52 v. Chr.',
    summary: 'Als Fortsetzung zu "De Re Publica" gedacht, behandelt dieses Werk die Gesetze, die den idealen Staat regieren sollten. Cicero argumentiert, dass wahres Recht im Naturrecht (lex naturae) wurzelt, das auf der universellen Vernunft basiert und allen Menschen angeboren ist.',
    takeaway: 'Wahre Gesetze leiten sich aus der Natur und der universellen Vernunft ab, nicht aus bloßer menschlicher Willkür.',
    structure: [
      { title: 'Buch 1', content: 'Grundlegung des Naturrechts als Basis aller Gesetzgebung.' },
      { title: 'Buch 2', content: 'Diskussion der Religionsgesetze des idealen Staates.' },
      { title: 'Buch 3', content: 'Diskussion der Magistratsgesetze und der Machtverteilung.' },
    ],
  };

export default work;
