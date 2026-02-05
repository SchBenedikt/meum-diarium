import { Work } from '@/types/blog';
const work: Work = {
  title: 'De Officiis',
  author: 'cicero',
  year: '44 v. Chr.',
  summary: `Ciceros meistgelesenes Werk über Ethik und Pflicht (44 v. Chr.). Ein Brief an seinen Sohn: Wie soll man sich verhalten? Welche Pflichten hat man? Kombination von stoischer Philosophie und römischer Praxis. Der einflussreichste ethische Text der westlichen Tradition.`,
  takeaway: `Univerelle Fragen ohne universelle Antworten: Nützlichkeit oder Ehrenhaftigkeit? Ciceros These: Sie sind komplementär, nicht gegensätzlich. Ein zeitloses Handbuch für ethisches Leben. Geschrieben im Chaos nach Caesars Ermordung - Ciceros letzte Verteidigung republikanischer Werte.`,
  structure: [
    { 
      title: 'Buch I: Das Ehrbare (honestum)', 
      content: `Das erste Buch behandelt die vier Kardinaltugenden - das Fundament der antiken Ethik. 
1.  Weisheit (sapientia/prudentia):
- Die Fähigkeit, Wahrheit zu erkennen und Gutes von Schlechtem zu unterscheiden
- Aber Vorsicht: Reine Kontemplation ohne Nutzen für die Gemeinschaft ist unzureichend
- Der Philosoph muss sich im öffentlichen Leben engagieren
2.` 
    },
    { 
      title: 'Buch II: Das Nützliche (utile)', 
      content: `Das zweite Buch ist pragmatischer und analysiert, was im Leben wirklich nützt. 
Quellen des Nutzens:
1.  Reichtum: Wichtig, aber nicht das Höchste.` 
    },
    { 
      title: 'Buch III: Konflikt zwischen Ehre und Nutzen', 
      content: `Das dritte Buch ist das brillanteste: Was tun, wenn Pflicht und Eigennutz zu kollidieren scheinen? 
Ciceros Grundthese:
Es gibt keinen echten Konflikt zwischen honestum und utile.  Was wirklich nützlich ist, kann nicht unehrenhaft sein - und vice versa.` 
    }
  ],
  translations: {}
};
export default work;
