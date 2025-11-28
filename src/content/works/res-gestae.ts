import { Work } from '@/types/blog';

const work: Work = {
    title: 'Res Gestae Divi Augusti',
    author: 'augustus',
    year: '14 n. Chr.',
    summary: 'Der "Tatenbericht des vergöttlichten Augustus" ist ein einzigartiger Rechenschaftsbericht des ersten römischen Kaisers. Augustus verfasste ihn kurz vor seinem Tod. Darin listet er in nüchterner, sachlicher Sprache seine politischen Ämter, militärischen Erfolge, öffentlichen Bauten und Geschenke an das römische Volk auf. Das Werk ist eine meisterhafte Selbstdarstellung und politische Propaganda.',
    takeaway: 'Ich habe die Republik wiederhergestellt und dem römischen Volk Frieden, Sicherheit und Wohlstand gebracht.',
    structure: [
      { title: 'Kapitel 1-14', content: 'Politische Laufbahn (cursus honorum) und verliehene Ehrungen.' },
      { title: 'Kapitel 15-24', content: 'Aufwendungen für das Volk (Spiele, Getreidespenden, Geldgeschenke).' },
      { title: 'Kapitel 25-33', content: 'Militärische Taten (res gestae) und Außenpolitik.' },
      { title: 'Kapitel 34-35', content: 'Zusammenfassende Darstellung seiner einzigartigen Stellung im Staat.' },
    ],
  };

export default work;
