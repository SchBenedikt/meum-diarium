import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '13',
  slug: 'er-ist-da',
  author: 'caesar',
  title: 'Er ist da.',
  
  excerpt: '',
  historicalDate: '100 v. Chr',
  historicalYear: -100,
  date: new Date().toISOString().split('T')[0],
  readingTime: 2,
  tags: ["Disclaimer","Geburt","Spenden"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/kkg_system_36041_Trimuvirat_von_Gaius_Julius_Casar_mit_Bezos_un_8094af79-7bf1-41d1-90f5-4e04f76403921.png',
  content: {
    diary: `Disclaimer: Meine gesamten Werke, wie De Bello Gallico, habe ich in der dritten Person geschrieben, damit es sachlich wirkt. Diesen Blog hier schreibe ich im Gegensatz dazu aus meiner persönlichen Sicht, so wie ich es erlebt habe. Sollte sich also eine ethnische Minderheit angegriffen fühlen, entschuldige ich mich. Gendern unterlasse ich nur aus Gründen der Lesbarkeit.

Aber jetzt kann es losgehen:

Endlich wurde ich geboren. Also versteht mich nicht falsch – ich bin jetzt schon ein wenig älter, ich kann ja schließlich schon meine Erlebnisse posten. Aber glaubt mir: Schon am Tag meiner Geburt, am 13. Juli 100 v. Chr., als ich in Rom geboren wurde, wusste ich, dass ich mal die Herrschaft über ganz Rom haben will. Damals habe ich noch nicht gedacht, dass die Welt größer ist. Jetzt will ich natürlich die Herrschaft über die Welt. Aber das nur nebenbei.

Ich entstamme dem angesehenen Geschlecht der Julier, die von der Göttin Venus abstammen. Meine Familie hat nicht wirklich viel Geld, aber dafür eine göttliche Abstammung. Daher ist es eigentlich auch meine Vorbestimmung, die Welt zu regieren. Findet Ihr nicht?

Auf alle Fälle: Meinen steinigen Weg zum Erfolg, an dem ihr euch gerne ein Vorbild nehmen könnt, werde ich in meinem neuen Blog chronologisch geordnet darstellen. Ihr, meine treuen Anhänger, seid die Ersten, die über meine neuesten Eroberungen erfahren werdet.

Im Krieg haben wichtige Ereignisse unscheinbare Ursachen.

Gaius Julius Caesar

Über diese Ursachen und wie sie wirklich passiert sind, nicht wie sie von meinen vielen Feinden fälschlich dargestellt werden, werde ich in diesem Blog schreiben.

Igitur lege cum voluptate!`,
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
