import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '5',
  slug: 'casar-verschlusselung',
  author: 'caesar',
  title: 'Cäsar-Verschlüsselung',
  
  excerpt: '',
  historicalDate: '50 v. Chr.',
  historicalYear: -50,
  date: new Date().toISOString().split('T')[0],
  readingTime: 2,
  tags: ["Cäsar-Verschlüsselung","Cäsarchiffre"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/vehglvku4qq.jpg',
  content: {
    diary: `Der römische Geschichtsschreiber Sueton hat in seiner Biographie über mich folgende Passage überliefert: „[…] si qua occultius perferenda erant, per notas scripsit, id est sic structo litterarum ordine, ut nullum verbum effici posset: quae si quis investigare et persequi velit, quartam elementorum litteram, id est D pro A et perinde reliquas commutet." Diese Worte beschreiben eine Methode, die heute viele Namen trägt: Cäsarchiffre, Cäsar-Verschiebung, Caesar Shift, Cäsarverschlüsselung, Einfacher Cäsar oder schlicht Cäsar Code.

Als Feldherr steht man oft vor der Herausforderung, geheime militärische Pläne vor den Augen der Feinde zu schützen. Meine Gegner würden alles darum geben, meine Strategien zu kennen und meine Befehle abzufangen. Aus dieser Notwendigkeit heraus entwickelte ich eine Verschlüsselungsmethode, die ebenso einfach wie wirksam ist. Die Funktionsweise ist denkbar simpel: Jeder Buchstabe einer Nachricht wird im Alphabet um drei Positionen nach rechts verschoben. So wird aus einem A ein D, aus einem B ein E und so weiter. Um die Anwendung zu erleichtern, verwende ich in dieser Verschlüsselung ausschließlich Kleinbuchstaben.

Diese Methode erwies sich als so nützlich, dass sie auch nach mir noch Verwendung fand. Mein Großneffe und Nachfolger Augustus nutzte ein ähnliches Verfahren, allerdings mit einer Verschiebung um nur einen Buchstaben und ohne das Alphabet zu rotieren. Anstelle eines X, des letzten Buchstabens des damaligen lateinischen Alphabets, schrieb er AA.

Man mag nun denken, dies sei die sicherste aller Verschlüsselungen. Doch das Besondere an meiner Methode liegt nicht in ihrer Unknackbarkeit, sondern darin, dass die Entschlüsselungsmethode selbst geheim bleiben muss. Sobald der Gegner das Prinzip kennt, lässt sich die Verschlüsselung leicht brechen. Es existieren unzählige solcher Verschlüsselungsmethoden, doch eine Wahrheit bleibt: Entweder stammt eine Verschlüsselung von mir, von Cäsar, oder sie wurde mir gestohlen.

Zu dieser Verschlüsselung gibt es noch eine Anekdote aus meinem Leben. Als man mir kurz vor meiner Ermordung auf dem Weg zum Senat eine Warnung zusteckte, soll ich sie mit den Worten „Cras legam" – „Morgen werde ich es lesen" – sorglos zur Seite gelegt haben. Ein fataler Fehler, wie sich zeigen sollte.`,
    scientific: ``
  },
  translations: {
  "en": {
    "title": "",
    "excerpt": "",
    "content": {
      "diary": "",
      "scientific": ""
    }
  },
  "la": {
    "title": "",
    "excerpt": "",
    "content": {
      "diary": "",
      "scientific": ""
    }
  }
}
};

export default post;
