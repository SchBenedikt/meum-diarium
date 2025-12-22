import { Work } from '@/types/blog';

const work: Work = {
  title: 'Res Gestae Divi Augusti',
  author: 'augustus',
  year: '14 n. Chr.',
  summary: 'Augustus\' autobiografischer Rechenschaftsbericht über seine Taten, verfasst kurz vor seinem Tod. Die Inschrift wurde auf Bronzetafeln vor seinem Mausoleum angebracht und im gesamten Reich verbreitet.',
  takeaway: 'Ein Meisterwerk der politischen Propaganda. Augustus präsentiert sich als Retter der Republik, während er faktisch das Kaisertum begründete. "Res gestae" = "vollbrachte Taten"',
  structure: [
    { title: 'Kapitel 1–14', content: 'Politische und militärische Ehrungen' },
    { title: 'Kapitel 15–24', content: 'Finanzielle Zuwendungen an das Volk und die Soldaten' },
    { title: 'Kapitel 25–33', content: 'Militärische Eroberungen und Expansion des Reiches' },
    { title: 'Kapitel 34–35', content: 'Zusammenfassung der Würden und Titel' }
  ],
  translations: {}
};

export default work;
