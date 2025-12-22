import { Work } from '@/types/blog';

const work: Work = {
  title: 'In Catilinam',
  author: 'cicero',
  year: '63 v. Chr.',
  summary: 'Ciceros vier berühmte Reden gegen Catilina, gehalten während seiner Amtszeit als Consul. Diese Reden deckten die Verschwörung Catilinas auf und führten zu dessen Flucht aus Rom.',
  takeaway: 'Ein Meisterwerk der politischen Rhetorik und ein Lehrstück über die Verteidigung der Republik gegen innere Feinde. Die erste Rede beginnt mit den unsterblichen Worten: "Quo usque tandem abutere, Catilina, patientia nostra?"',
  structure: [
    { title: 'Oratio I', content: 'Gehalten im Senat (8. Nov. 63): Direkter Angriff auf Catilina, der anwesend ist' },
    { title: 'Oratio II', content: 'Vor dem Volk (9. Nov. 63): Erklärung der Situation nach Catilinas Flucht' },
    { title: 'Oratio III', content: 'Vor dem Volk (3. Dez. 63): Verkündung der aufgedeckten Beweise' },
    { title: 'Oratio IV', content: 'Im Senat (5. Dez. 63): Debatte über das Schicksal der Verschwörer' }
  ],
  translations: {}
};

export default work;
