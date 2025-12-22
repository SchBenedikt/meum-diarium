import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '6',
  slug: 'darum-mag-mich-jeder',
  author: 'caesar',
  title: 'Darum mag mich jeder',
  
  excerpt: '',
  historicalDate: '50 v. Chr.',
  historicalYear: -50,
  date: new Date().toISOString().split('T')[0],
  readingTime: 1,
  tags: ["Armee","Clementia Caesaris","Feind","Rom","Senat"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/04/kkg_system_36041_Elon_Musk_und_Mark_Zuckerberg_mit_romischen_St_9606655e-301d-4ec9-b2a9-6c5eba27eca6.png',
  content: {
    diary: `Ich gestehe es offen: Es gibt Momente, in denen ich vielleicht nicht immer alle Einzelheiten meiner Taten erzähle. Doch was würde es ändern? Die Geschichte wird dennoch geschrieben, und so, wie ich sie niederschreibe, wird sie erinnert werden.

Was mir jedoch zugutegehalten werden muss, ist meine außergewöhnliche Milde gegenüber meinen besiegten Gegnern. Habt ihr jemals von einem Feldherrn gehört, der seine Feinde derart nachsichtig behandelt? Ich habe mich bewusst entschieden, nicht mit crudelitas, mit Grausamkeit zu herrschen. Statt das Schwert gegen die Besiegten zu erheben, bot ich ihnen Vergebung an. Diese Herrschertugend hat mir einen besonderen Namen eingebracht: Clementia Caesaris – die Milde Caesars.

Man mag sich fragen, worin meine Barmherzigkeit liegt. Ich habe es stets so gehalten, dass ich nach einem Sieg keine grausamen Vergeltungsakte verübte. Stattdessen bot ich den Unterlegenen die Hand zur Versöhnung. Was kann ich dafür, wenn viele meiner ehemaligen Gegner daraufhin zu meinen treuesten Anhängern wurden? Habe ich einen Fehler begangen, indem ich Feinde verschonte? Offenbar nicht, denn viele von ihnen wechselten die Seiten und unterstützten mich fortan. Aus Dankbarkeit, wie sie sagten, standen sie mir bei und verhalfen mir zu noch größerer Macht. Ohne diese neuen Anhänger wäre ich nie so weit gekommen.

Es ist eine alte Wahrheit, die ich in meinen Schriften über den Gallischen Krieg festgehalten habe: "Libenter homines id quod volunt credunt" – Die Menschen glauben im Allgemeinen gern, was sie wünschen. Vielleicht wünschten sich meine ehemaligen Gegner einen milden Herrscher, und so glaubten sie an meine Clementia. Diese Strategie der Milde war nicht nur ein Akt der Gnade, sondern auch politische Klugheit.

Ich danke euch, meinen treuen Anhängern, die ihr weiterhin für unsere gemeinsame Sache kämpft. Ohne euch wäre mein Aufstieg unmöglich gewesen.`,
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
