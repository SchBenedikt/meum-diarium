import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '2',
  slug: 'die-verschworung-gegen-mich',
  author: 'caesar',
  title: 'Die Verschwörung gegen mich',
  
  excerpt: '',
  historicalDate: '44 v. Chr',
  historicalYear: -44,
  date: new Date().toISOString().split('T')[0],
  readingTime: 2,
  tags: ["Brutus","Caesarianer","Dolch","Feind","Mord","Verschwörung"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/kkg_system_36041_realistic_face_of_caesar_with_color_9ac25bcb-2a41-4285-9abf-90d67e3cb8ee1.png',
  content: {
    diary: `15. März 44 v. Chr. – Die Iden des März.

Ich schreibe dies in dem Wissen, dass es meine letzten Worte sein könnten. An diesem Tag fand eine Senatssitzung im Pompeius-Theater statt, und obwohl meine Frau Calpurnia mir von schlimmen Träumen berichtete, ließ ich mich von Decimus Brutus überreden, dennoch zu gehen. Ein Fehler, wie sich herausstellen sollte.

Anfang des Jahres 44 v. Chr. hatten republikanisch gesinnte Senatoren unter der Leitung des Gaius Cassius Longinus begonnen, eine Verschwörung gegen mich zu schmieden. Sie sahen in mir eine Bedrohung für die alte Ordnung, für ihre Privilegien, für die Republik, wie sie sie kannten. Dabei übersahen sie, dass diese Republik längst tot war, dass nur ich noch ihre verwesende Hülle am Leben erhielt.

Als ich das Theater betrat, umringten mich die Senatoren. Was folgte, war keine ehrenwerte Schlacht, sondern ein Gemetzel. Dreiundzwanzig Dolchstiche trafen meinen Körper. Sie kamen von allen Seiten, von Männern, denen ich vertraut hatte, denen ich Ämter und Würden verliehen hatte. Ich hatte sie nach Pharsalos begnadigt, ihnen meine Clementia gezeigt, und dies war ihre Antwort.

Der schmerzhafteste Moment kam, als ich Marcus Iunius Brutus erkannte, der ebenfalls das Messer gegen mich erhob. Brutus, den ich wie einen Sohn behandelt hatte, den ich gefördert und geschützt hatte. Manche Gerüchte behaupten sogar, er sei tatsächlich mein Sohn. Als ich ihn sah, soll ich – so wird man es später berichten – auf Griechisch ausgerufen haben: "Καὶ σύ, τέκνον" – "Auch du, mein Kind?"

Ob ich diese Worte wirklich gesprochen habe oder ob dies nur eine dramatische Ausschmückung der Historiker ist, weiß ich nicht mehr. In diesem Moment des Verrats, umgeben von Dolchen und dem Blut meiner Wunden, verschwimmt die Erinnerung. Vielleicht habe ich gar nichts gesagt. Vielleicht habe ich nur ungläubig auf den Mann gestarrt, dem ich so sehr vertraut hatte.

Was ich mit Sicherheit weiß: Dies ist das Ende. Rom wird nie wieder sein, was es war. Die Verschwörer glauben, sie hätten die Republik gerettet. Welch eine Naivität! Sie haben nur das Chaos eingeladen. Antonius wird sich rächen, Octavian wird aufsteigen, und am Ende wird das Kaiserreich entstehen, das ich nur angedeutet, aber nie vollständig errichtet habe.

Ich sterbe nicht als freier Mann der Republik, sondern als letzter Versuch, Rom vor sich selbst zu retten. Die Verschwörer werden für ihren Verrat bezahlen. Innerhalb weniger Jahre werden sie alle tot sein, verfolgt von meinen treuen Anhängern, den Caesarianern. Antonius und Octavian werden sie jagen wie Tiere, und keiner wird entkommen.

Dies sind meine letzten Gedanken: Rom, ich habe dich geliebt. Ich habe dich größer gemacht, reicher, mächtiger. Und du hast mich mit Dolchen belohnt.

Gaius Julius Caesar
15. März 44 v. Chr. – Die Iden des März`,
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
