import { Work } from '@/types/blog';

const work: Work = {
  title: 'De Bello Gallico',
  author: 'caesar',
  year: '58-50 v. Chr.',
  summary: 'Caesars Bericht über die Eroberung Galliens ist nicht nur ein militärisches Meisterwerk, sondern auch ein Lehrbuch der Propaganda. In klarer, prägnanter Prosa schildert er acht Jahre Krieg, ethnographische Beobachtungen und strategische Brillanz.',
  takeaway: 'Eine Kombination aus militärischem Bericht, politischer Rechtfertigung und literarischer Kunst. Zeigt, wie Geschichte von Siegern geschrieben wird.',
  structure: [
    { title: 'Buch I-II', content: 'Unterwerfung der Helvetier und Belgier (58-57 v. Chr.)' },
    { title: 'Buch III-IV', content: 'Feldzüge in der Bretagne und erste Rheinüberquerung (56-55 v. Chr.)' },
    { title: 'Buch V-VI', content: 'Expeditionen nach Britannien und ethnographische Exkurse (55-54 v. Chr.)' },
    { title: 'Buch VII', content: 'Der Aufstand unter Vercingetorix und die Belagerung von Alesia (52 v. Chr.)' },
    { title: 'Buch VIII', content: 'Endgültige Pazifizierung (von Aulus Hirtius ergänzt, 51-50 v. Chr.)' }
  ],
  translations: {}
};

export default work;
