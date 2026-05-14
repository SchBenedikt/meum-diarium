import { Work } from '@/types/blog';
const work: Work = {
  title: 'Tusculanae Disputationes',
  author: 'cicero',
  year: '45 v. Chr.',
  summary: `Die Tusculanae Disputationes (Tusculanische Gespräche) sind Ciceros umfassendstes Werk zur praktischen Philosophie. In fünf Büchern, als fiktive Gespräche auf seinem Landgut in Tusculum, behandelt er die zentralen Fragen des menschlichen Lebens: die Furcht vor dem Tod, der Umgang mit Schmerz, die Überwindung von Kummer, die Beherrschung der Leidenschaften und die Frage nach dem glücklichen Leben.`,
  takeaway: `Philosophie ist die Kunst der Seelenheilung. Cicero verbindet stoische und platonische Lehren zu einer praktischen Lebensphilosophie: Der Tod ist kein Übel, Schmerz ist erträglich, Tugend macht glücklich. Das berühmte Diktum "Cura ut valeas!" (Sorge, dass es dir gut geht!) fasst das Programm zusammen.`,
  structure: [
    {
      title: 'Buch I: Vom Tode',
      content: `Sokrates' und Platons Lehre von der Unsterblichkeit der Seele. Der Tod ist entweder eine Befreiung oder das Ende – in beiden Fällen kein Übel. Ciceros tröstliche Worte: Im Tod verlieren wir nichts, denn wir haben das Leben gehabt.`
    },
    {
      title: 'Buch II: Vom Ertragen des Schmerzes',
      content: `Schmerz ist das größte Übel nach Epikur, aber nicht nach der Stoa. Cicero argumentiert: Der Mensch kann durch Tapferkeit und Vernunft jeden Schmerz überwinden. Beispiele aus der römischen Geschichte zeigen, dass Helden auch unter Folter standhaft blieben.`
    },
    {
      title: 'Buch III: Von der Überwindung des Kummers',
      content: `Trauer und Kummer sind natürliche, aber überwindbare Affekte. Cicero bietet konkrete Strategien: Ablenkung, Zeit, Vernunftargumente. Das Buch ist eine Trostschrift für alle Leidenden.`
    },
    {
      title: 'Buch IV: Von den Affekten',
      content: `Systematische Lehre von den Leidenschaften: Die stoische Affektlehre mit ihrer Einteilung in vier Hauptaffekte (Lust, Unlust, Begierde, Furcht). Die stoische Weisheit besteht darin, alle Affekte zu überwinden.`
    },
    {
      title: 'Buch V: Vom glücklichen Leben',
      content: `Der berühmte Schluss: Tugend allein genügt zum Glück. Der Weise ist auch unter schwierigsten Umständen glücklich. Die gesamte Philosophie zielt auf ein einziges Ziel: die Kunst des glücklichen Lebens.`
    }
  ],
  translations: {}
};
export default work;
