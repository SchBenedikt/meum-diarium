import { Work } from '@/types/blog';

const work: Work = {
    title: 'Epistulae Morales ad Lucilium',
    author: 'seneca',
    year: 'ca. 62-65 n. Chr.',
    summary: 'Eine Sammlung von 124 Briefen, die Seneca in seinen letzten Lebensjahren an seinen Freund Lucilius Iunior schrieb. Die Briefe sind keine private Korrespondenz, sondern philosophische Essays in Briefform. Sie behandeln ein breites Spektrum stoischer Themen, von der Freundschaft über den Tod bis hin zur richtigen Nutzung der Zeit, und dienen als praktischer Leitfaden für ein tugendhaftes Leben.',
    takeaway: 'Der Weg zur Weisheit ist ein tägliches Üben. Die Philosophie ist keine Theorie, sondern eine Lebenskunst.',
    structure: [
      { title: 'Briefe 1-29', content: 'Grundlagen der stoischen Ethik: Umgang mit Zeit, Furcht und Begierden.' },
      { title: 'Briefe 30-80', content: 'Vertiefung philosophischer Konzepte wie Tugend, Seele und die Natur des Guten.' },
      { title: 'Briefe 81-124', content: 'Spezifischere philosophische Fragen und Reflexionen über das Alter und den Tod.' },
    ],
  };

export default work;
