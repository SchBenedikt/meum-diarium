import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '7',
  slug: 'helvetierkrieg-teil-2',
  author: 'caesar',
  title: 'Helvetierkrieg – Teil 2',
  
  excerpt: '',
  historicalDate: '52 v. Chr.',
  historicalYear: -52,
  date: new Date().toISOString().split('T')[0],
  readingTime: 1,
  tags: ["Armee","Gallien","Haeduer","Schlacht","Vercingetorix"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/kkg_system_36041_picture_of_gaius_julius_caesar_crossing_rubico_c2115a9b-d146-4690-8370-abd3662b44231.png',
  content: {
    diary: `Meine Eroberungen liefen bis vor kurzem richtig gut. Nein, nein, nein! Nicht meine Eroberungen. Ich verteidige nur mein Land. Aber es heißt ja schließlich: Angriff ist die beste Verteidigung. Und wenn dabei auch etwas in meine Kasse fließt, kann man mir das ja nicht übel nehmen, oder? Ihr seht ja, was ich alles leiste.

Das haben manche meiner römischen Amtskollegen aber nicht verstanden, weshalb ich mich um 52 v. Chr. in Rom rechtfertigen musste. Das mache ich immer, auch wenn es nervig wird.

Das Problem nur dieses Mal ist: Vor einigen Nächten hat eine riesige Gruppe aus wilden Mördern unter der Führung von Vercingetorix einige unserer Städte überfallen. Dabei wurden auch römische Bürger umgebracht. Wenigstens konnten sie mich nicht von meinen Truppen isolieren.

Natürlich kann ich mir diesen inhonestus caedes nicht gefallen lassen und machte mich deshalb sofort auf den Weg zu meiner Armee. Trotz des starken Schneefalls machten wir uns sofort auf den Weg, um für Gerechtigkeit zu sorgen. Nachdem wir die Stadt zurückerobert hatten, brannten die Gallier alles nieder, um unsere Versorgungslinien zu zerstören.

Wir überlebten es zwar, mussten aber einen hohen Preis zahlen: Nun schlossen sich auch noch unsere ehemaligen Verbündeten, die Haeduer, dem Aufstand an.

Ab jetzt gehe ich mit Härte gegen alle meine Gegner vor. Mit Blick auf Rom aber, hier habe ich schon einiges geplant, mehr dazu wenn es soweit ist, lasse ich bei manchen Völkern auch Milde walten.

Egal was kommen wird, ich werde mich immer an einen meiner berühmtesten Sprüche halten:

Omnium consensu.

Mit dem Einverständnis aller.

Gaius Julius Caesar`,
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
