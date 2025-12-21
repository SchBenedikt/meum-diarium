import { Work } from '@/types/blog';

const work: Work = {
  title: 'De Bello Civili',
  author: 'caesar',
  year: '49-48 v. Chr.',
  summary: 'Caesars Rechtfertigungsschrift für den Bürgerkrieg gegen Pompeius und den Senat. Persönlicher und emotionaler als De Bello Gallico, zeigt es den Todeskampf der Römischen Republik aus der Sicht des Siegers.',
  takeaway: 'Ein historisches Dokument über den Untergang der Republik – und zugleich eine Verteidigungsschrift eines Mannes, der die Demokratie zerstörte.',
  structure: [
    { title: 'Buch I', content: 'Rubikon-Überquerung, Eroberung Italiens, Pompeius\' Flucht (49 v. Chr.)' },
    { title: 'Buch II', content: 'Feldzüge in Spanien gegen Pompeius\' Legaten' },
    { title: 'Buch III', content: 'Schlacht bei Pharsalos, Pompeius\' Tod, Ägyptischer Krieg (48 v. Chr.)' }
  ],
  translations: {}
};

export default work;
