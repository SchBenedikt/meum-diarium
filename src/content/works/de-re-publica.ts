import { Work } from '@/types/blog';

const work: Work = {
  title: 'De Re Publica',
  author: 'cicero',
  year: '54–51 v. Chr.',
  summary: 'Ein philosophischer Dialog über den idealen Staat, inspiriert von Platons gleichnamigem Werk. Cicero diskutiert verschiedene Staatsformen und plädiert für eine gemischte Verfassung nach römischem Vorbild.',
  takeaway: 'Eine Verteidigung der römischen Republik als beste Staatsform. Enthält das berühmte "Somnium Scipionis" (Traum des Scipio), eine Vision des Jenseits.',
  structure: [
    { title: 'Buch I–II', content: 'Definition des Staates und historische Entwicklung der römischen Verfassung' },
    { title: 'Buch III', content: 'Gerechtigkeit als Grundlage des Staates (größtenteils verloren)' },
    { title: 'Buch IV–V', content: 'Erziehung und Eigenschaften des idealen Staatsmanns' },
    { title: 'Buch VI', content: 'Das "Somnium Scipionis" – Vision der Unsterblichkeit der Seele' }
  ],
  translations: {}
};

export default work;
