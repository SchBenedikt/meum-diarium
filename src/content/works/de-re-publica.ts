import { Work } from '@/types/blog';

const work: Work = {
    title: 'De Re Publica',
    author: 'cicero',
    year: 'ca. 54-51 v. Chr.',
    summary: 'Ein philosophischer Dialog in sechs Büchern über die beste Staatsform und die Pflichten des idealen Staatsmannes. Cicero argumentiert, dass die römische Republik in ihrer idealen Form eine perfekte Mischverfassung darstellt, die monarchische, aristokratische und demokratische Elemente vereint.',
    takeaway: 'Die beste Staatsform ist eine Mischung aus Monarchie, Aristokratie und Demokratie, die Stabilität und Freiheit gewährleistet.',
    structure: [
      { title: 'Buch 1', content: 'Definition des Staates und Diskussion der drei Grundtypen von Verfassungen.' },
      { title: 'Buch 2', content: 'Historische Entwicklung der römischen Verfassung als Beispiel für die ideale Mischverfassung.' },
      { title: 'Buch 3-5', content: 'Diskussion über Gerechtigkeit und die Rolle des idealen Staatsmannes (Rector Rei Publicae). (Größtenteils verloren)' },
      { title: 'Buch 6', content: 'Somnium Scipionis (Scipios Traum), eine Vision über die kosmische Ordnung und die Belohnung des Staatsmannes im Jenseits.' },
    ],
  };

export default work;
