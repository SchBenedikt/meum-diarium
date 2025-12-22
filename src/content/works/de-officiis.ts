import { Work } from '@/types/blog';

const work: Work = {
  title: 'De Officiis',
  author: 'cicero',
  year: '44 v. Chr.',
  summary: 'Ciceros letztes philosophisches Werk, verfasst kurz nach Caesars Ermordung. Ein Brief an seinen Sohn über moralische Pflichten, Tugenden und ethisches Verhalten.',
  takeaway: 'Das meistgelesene Werk Ciceros in der Neuzeit. Eine praktische Anleitung für tugendhaftes Leben, die bis heute Einfluss auf die westliche Ethik hat.',
  structure: [
    { title: 'Buch I', content: 'Das Ehrbare (honestum) – die vier Kardinaltugenden' },
    { title: 'Buch II', content: 'Das Nützliche (utile) – praktischer Nutzen im Leben' },
    { title: 'Buch III', content: 'Konflikte zwischen Ehre und Nutzen – wie entscheidet man?' }
  ],
  translations: {}
};

export default work;
