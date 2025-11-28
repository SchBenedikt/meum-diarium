import { Work } from '@/types/blog';

const work: Work = {
    title: 'De Officiis',
    author: 'cicero',
    year: '44 v. Chr.',
    summary: 'Ciceros letztes großes philosophisches Werk, verfasst als Brief an seinen Sohn Marcus. Es ist ein praktischer Leitfaden zur Moralphilosophie und behandelt die Pflichten (officia) eines römischen Bürgers. Cicero diskutiert, was moralisch ehrenhaft (honestum) ist und was nützlich (utile) ist und wie man Konflikte zwischen beiden löst.',
    takeaway: 'Das moralisch Richtige ist immer auch das wahrhaft Nützliche. Es gibt keinen echten Konflikt zwischen Moral und Nutzen.',
    structure: [
      { title: 'Buch 1', content: 'Über das Ehrenhafte (honestum) und seine vier Quellen: Weisheit, Gerechtigkeit, Tapferkeit, Mäßigung.' },
      { title: 'Buch 2', content: 'Über das Nützliche (utile) und wie man Ansehen und Vertrauen gewinnt.' },
      { title: 'Buch 3', content: 'Über den Konflikt zwischen dem Ehrenhaften und dem scheinbar Nützlichen.' },
    ],
  };

export default work;
