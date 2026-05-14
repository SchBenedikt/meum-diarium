import { Work } from '@/types/blog';
const work: Work = {
  title: 'Apologie',
  author: 'sokrates',
  year: '399 v. Chr.',
  summary: `Die Apologie (griech. ἀπολογία – Verteidigungsrede) ist Platons Darstellung der Verteidigungsrede, die Sokrates 399 v. Chr. vor dem athenischen Geschworenengericht hielt. Angeklagt wegen Gottlosigkeit (Asebie) und Verführung der Jugend, verteidigt Sokrates seine philosophische Mission als göttlichen Auftrag. Die Rede ist kein Plädoyer für Freispruch, sondern eine grundsätzliche Rechtfertigung des Philosophierens.`,
  takeaway: `Philosophie als Dienst an der Wahrheit – auch auf Kosten des eigenen Lebens. Sokrates zeigt, dass ein Leben ohne Prüfung (exetasis) nicht lebenswert ist. Sein Prozess wird zum Gründungsdokument der abendländischen Philosophie: Der Philosoph gehorcht dem Gesetz, aber mehr noch der inneren Stimme der Vernunft.`,
  structure: [
    {
      title: 'Erster Teil: Die alten Ankläger',
      content: `Sokrates beginnt mit der Unterscheidung zwischen seinen alten und neuen Anklägern. Die alten, anonymen Vorwürfe (er forsche über Dinge unter der Erde und am Himmel, mache das schwächere Argument stärker) sind gefährlicher als die konkrete Anklage durch Meletos, weil sie seit Jahren als Vorurteil wirken.`
    },
    {
      title: 'Zweiter Teil: Die Widerlegung',
      content: `Sokrates geht systematisch auf die Anklagepunkte ein. Er befragt Meletos im Kreuzverhör und zeigt Widersprüche auf: Wenn Sokrates die Jugend verderbe, dann doch wohl unfreiwillig – und unfreiwilliges Unrecht sollte nicht bestraft, sondern belehrt werden. Das Orakel von Delphi habe ihn als weisesten bezeichnet, weil er als Einziger weiß, dass er nichts weiß.`
    },
    {
      title: 'Dritter Teil: Das Gegenplädoyer',
      content: `Nach dem Schuldspruch (mit knapper Mehrheit) darf Sokrates einen Gegenantrag zur Strafe stellen. Statt der Todesstrafe schlägt er – ironisch – die Speisung im Prytaneion vor, die höchste Ehre Athens. Oder, realistische, eine Geldstrafe. Seine Weigerung, das Philosophieren aufzugeben, ist kategorisch: „Ein Leben ohne Prüfung ist nicht lebenswert."`
    },
    {
      title: 'Vierter Teil: Die Prophezeiung',
      content: `Nach der Verurteilung zum Tod wendet Sokrates sich an die Mitbürger. Er prophezeit, dass seine Ankläger durch ihr Unrecht mehr Schaden erleiden werden als er. Der Tod sei entweder ein tiefer Traum ohne Schmerz oder die Reise zu den Verstorbenen – in beiden Fällen kein Übel. Seine letzten Worte: „Ich gehe nun hin, um zu sterben, ihr aber, um zu leben. Wer von uns den besseren Gang geht, ist allen verborgen außer dem Gott."`
    }
  ],
  translations: {}
};
export default work;
