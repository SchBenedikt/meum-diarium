import { Work } from '@/types/blog';
const work: Work = {
  title: 'De Clementia',
  author: 'seneca',
  year: '55–56 n. Chr.',
  summary: `De Clementia (Über die Milde) ist Senecas Fürstenspiegel an den jungen Kaiser Nero. In zwei Büchern legt Seneca dar, dass Milde (clementia) die wichtigste Herrschertugend ist. Ein gnädiger Herrscher ist sicherer als ein grausamer, denn er wird geliebt statt gefürchtet. Das Werk ist zugleich philosophische Ethik und praktische politische Beratung.`,
  takeaway: `Milde ist die Stärke des wahren Herrschers. Wer durch Furcht regiert, hat alles zu fürchten. Seneca entwirft das Ideal des clementen Monarchen, der seine Macht nicht durch Gewalt, sondern durch Güte sichert. Die Schrift prägte das europäische Bild des "guten Herrschers" nachhaltig.`,
  structure: [
    {
      title: 'Buch I: Theorie der Milde',
      content: `Definition der Milde als maßvolle Haltung des Herrschers bei der Bestrafung. Abgrenzung von Grausamkeit (crudelitas) und Mitleid (misericordia). Nero wird als Beispiel eines milden Herrschers gepriesen, der sein Wort hält.`
    },
    {
      title: 'Buch II: Praxis der Milde',
      content: `Konkrete Ratschläge: Der Herrscher soll langsam strafen und schnell belohnen. Er soll nie im Zorn urteilen. Der weise Herrscher gleicht den Göttern: Sie sind gütig, nicht rachsüchtig. Wer fürchtet, selbst gefürchtet zu werden, lebt in ständiger Angst.`
    }
  ],
  translations: {}
};
export default work;
