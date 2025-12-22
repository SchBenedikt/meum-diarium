import { Work } from '@/types/blog';

const work: Work = {
  title: 'Philippicae',
  author: 'cicero',
  year: '44–43 v. Chr.',
  summary: 'Vierzehn flammende Reden gegen Marcus Antonius, gehalten nach Caesars Tod. Benannt nach den Reden des Demosthenes gegen Philipp von Makedonien.',
  takeaway: 'Ciceros letzter Kampf für die Republik – ein verzweifelter Versuch, die Alleinherrschaft zu verhindern. Diese Reden kosteten ihn letztlich das Leben.',
  structure: [
    { title: 'Philippica I–II', content: 'Erste Attacken gegen Antonius (Sept./Okt. 44)' },
    { title: 'Philippica III–XIV', content: 'Eskalation des Konflikts (Dez. 44 – April 43)' }
  ],
  translations: {}
};

export default work;
