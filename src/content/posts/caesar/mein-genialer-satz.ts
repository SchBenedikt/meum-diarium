import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '10',
  slug: 'mein-genialer-satz',
  author: 'caesar',
  title: 'Mein genialer Satz',
  
  excerpt: '',
  historicalDate: '58 v. Chr.',
  historicalYear: -58,
  date: new Date().toISOString().split('T')[0],
  readingTime: 2,
  tags: ["Gallien"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/04/kkg_system_36041_romische_Schriftrollen_mit_Gesetzen_5849504c-6029-491e-91f3-da42b0893bf4.png',
  content: {
    diary: `Wer kennt diesen berühmten Anfang nicht?

"Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur."

Mit diesen Worten beginne ich mein Werk über den Gallischen Krieg, De Bello Gallico. Ein Satz, der Geschichte schreiben sollte und bis heute in den Schulen gelehrt wird. Dass spätere Generationen meine Worte auswendig lernen werden, zeigt, welchen bleibenden Eindruck meine Taten und Schriften hinterlassen haben.

Die Übersetzung lautet: "Ganz Gallien ist in drei Teile geteilt, einen davon bewohnen die Belgier, den anderen die Aquitaner, den dritten, die in eigener Sprache Kelten, in unserer Gallier genannt werden."

Diese Dreiteilung ist nicht nur eine geographische Beschreibung, sondern auch das Ergebnis meiner Eroberungen. Ich habe dieses riesige Gebiet unter römische Herrschaft gebracht und dabei die natürlichen Grenzen wie den Rhein als Demarkationslinie zwischen Galliern und Germanen etabliert. Die drei Regionen unterscheiden sich in Sprache und Kultur, und ich habe sie alle unterworfen.

Der Satz ist mehr als nur der Anfang eines Berichts. Er ist die Ankündigung einer vollständigen Umgestaltung dieser Gebiete. Was zuvor ein wirres Durcheinander barbarischer Stämme war, habe ich in eine geordnete römische Provinz verwandelt. Die Belgier im Norden zwischen Seine, Marne und Rhein, die Aquitanier im Südwesten zwischen Pyrenäen und Garonne, und die Kelten im Kernland zwischen Loire und Seine – alle erkannten schließlich die Überlegenheit Roms an.

Manche werden später behaupten, diese Dreiteilung sei zu vereinfacht, dass die ethnischen Grenzen in Wirklichkeit fließender waren. Aber darum geht es nicht. Ich habe Gallien nicht nur beschrieben, sondern auch erobert und geordnet. Mein Werk ist zugleich Bericht und Rechtfertigung, Chronik und Propaganda.

"Gallia est omnis divisa in partes tres..." – Ein Satz, der die Welt veränderte.

Gaius Julius Caesar`,
    scientific: `## Historischer Kontext

Der berühmte Eröffnungssatz von Caesars *De Bello Gallico* ist nicht nur literarisch brillant, sondern auch ethnographisch bedeutsam. Caesar präsentiert hier eine vereinfachte, aber zweckdienliche Dreiteilung Galliens.

### Die drei Völkergruppen

**Die Belgae** (Belgier) bewohnten den nördlichen Teil Galliens zwischen Seine, Marne und Rhein. Sie galten als besonders kriegerisch, da sie am weitesten von der römischen Zivilisation entfernt lebten.

**Die Aquitani** (Aquitanier) siedelten im Südwesten zwischen Pyrenäen und Garonne. Kulturell waren sie den Iberern näher verwandt als den Kelten.

**Die Celtae/Galli** (Kelten/Gallier) bewohnten das Kernland zwischen Loire und Seine. Diese Gruppe bildete den größten Teil der gallischen Bevölkerung.

### Wissenschaftliche Einordnung

Moderne Archäologen und Historiker sehen Caesars Dreiteilung als stark vereinfacht an. Die kulturellen und ethnischen Grenzen waren in Wirklichkeit fließender als dargestellt. Caesars Darstellung diente auch propagandistischen Zwecken: Sie rechtfertigte die Eroberung als Ordnung eines chaotischen Gebiets.

### Literarische Bedeutung

Der Satz ist stilistisch meisterhaft. Die symmetrische Struktur und die klare Gliederung zeigen Caesars rhetorische Ausbildung. Er etabliert sofort den sachlich-dokumentarischen Ton, der das gesamte Werk prägt.

**Quellen:** Rüpke, J. (2005) *Die Religion der Römer*; Woolf, G. (1998) *Becoming Roman*`
  },
  translations: {
  "en": {
    "title": "My Genius Sentence",
    "excerpt": "Who doesn\\'t know my famous opening?",
    "content": {
      "diary": "Who doesn't know my famous opening?\n\nGallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.\n\nHave you ever heard such a genius idea? Yes, yes... I know you don't understand it 😦. Why should you? You probably didn't pay attention in Latin class.... I was looking forward to learning something about Rome's history back then. Every student has to learn this sentence by heart in Latin class. Sometimes they are even quizzed on it... You see here how much influence I have. I even influence the curriculum. I am simply someone who writes history. And when even children learn my quotes, then you see again how I am admired by everyone. But we are straying from the subject. My genius sentence translates as follows:\n\nAll Gaul is divided into three parts, one of which the Belgae inhabit, the Aquitani another, those who in their own language are called Celts, in our Gauls, the third.\n\nI thought that through well, didn't I? Feel free to write in the comments what you think about it (But only positive things!). No one has ever come up with that before: And of course I conquered the whole area too. Just like that. Because I'm so good.\n\nAnd so the Rhine served as a natural border between the Gauls and the Germans. All in all, my conquests separated three areas in all of Gaul, each differing in language and culture. I created that! Isn't that great?\n\nBut there are still a few people who are quite jealous and now claim that everything I thought of is wrong again...\n\nBut do you really think anyone could cast doubt on my words, my deeds, my achievements? I not only described Gaul but also conquered it.\n\nGallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.\n\nAll Gaul is divided into three parts, one of which the Belgae inhabit, the Aquitani another, those who in their own language are called Celts, in our Gauls, the third.\n\nGaius Julius Caesar",
      "scientific": ""
    }
  },
  "la": {
    "title": "Sententia Mea Ingeniosa",
    "excerpt": "Quis initium meum clarissimum nescit?",
    "content": {
      "diary": "Quis initium meum clarissimum nescit?\n\nGallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.\n\nAudivistisne umquam talem sententiam ingeniosam? Ita, ita... Scio vos non intellegere 😦. Cur intellegeretis? Fortasse in schola Latina non attenti eratis.... Ego tunc gaudebam aliquid de historia Romana discere. In schola Latina omnis discipulus hanc sententiam ediscere debet. Interdum etiam interrogantur... Videtis hic quantum valeam. Etiam cursum studiorum flecto. Sum simpliciter aliquis qui historiam scribit. Et cum etiam pueri dicta mea discunt, tum rursus videtis quomodo ab omnibus admirer. Sed a re aberramus. Sententia mea ingeniosa sic vertitur:\n\nGallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.\n\nHoc bene excogitavi, nonne? Scribite libenter in commentariis quid de hoc sentiatis (Sed tantum positiva!). Nemo antea hoc invenit: Et totam regionem naturaliter etiam vici. Simpliciter. Quia tam bonus sum.\n\nEt sic Rhenus finis naturalis inter Gallos et Germanos fuit. Omnino per victorias meas tres partes in tota Gallia divisae sunt, quae lingua et cultura differunt. Hoc ego creavi! Nonne mirabile est?\n\nSed sunt tamen pauci qui valde invidi sunt et nunc affirmant omnia rursus falsa esse quae excogitavi...\n\nSed vere creditis quemquam verba mea, facta mea, res gestas meas in dubium vocare posse? Galliam non solum descripsi sed etiam vici.\n\nGallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.\n\nGaius Iulius Caesar",
      "scientific": ""
    }
  }
}
};

export default post;
