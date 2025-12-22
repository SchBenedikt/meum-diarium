import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '9',
  slug: 'prokonsulat',
  author: 'caesar',
  title: 'Prokonsulat',
  
  excerpt: '',
  historicalDate: '58 v. Chr.',
  historicalYear: -58,
  date: new Date().toISOString().split('T')[0],
  readingTime: 1,
  tags: ["Caesoninus","Gallia Cisaplina","Gallia Transaplina","Illyrien","Prokonsulat"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/ec65a34c-cfae-4a84-a7f1-2136c4327433.png',
  content: {
    diary: `Jetzt hätte ich doch fast Ärger mit diesen Gesetzeshütern bekommen. Die wollten mich doch tatsächlich verklagen und verurteilen, sobald ich wieder Privatmann bin! Aber das können die sich abschminken. Nur weil ich nicht alles so gemacht habe, wie es vielleicht vorgeschrieben ist. So ist es halt, wenn man viel Macht hat. Es gibt immer Gegner, die das nicht wollen.

Aber wir als Triumvirat sind stark und kämpfen dafür auch. Deswegen haben mir Pompeius und Crassus geholfen, dass es so weit gar nicht erst kommt. Deswegen bin ich auch noch hier und berichte voller Freude, dass ich Prokonsul geworden bin. Ein Prokonsul ist ein römischer Stadthalter, der für ein Jahr lang im Amt ist und den Konsul in den Provinzen vertritt. Auf alle Fälle bin ich jetzt vorerst für fünf Jahre Prokonsul. Da muss ich jetzt zeigen, was ich alles kann.

Meine Gebiete sind dieses Mal ziemlich groß. Von Illyrien zu Gallien Cisalpina und Gallien Transalpina – das heutige Gebiet umfasst die Niederlande, Frankreich und Belgien. Das heißt, ich kann große Eroberungskämpfe führen, und mir muss der Senat verzeihen, denn ich bin der einzig wahre Führer Roms!

Doch bevor ich mich auf den Weg nach Gallien mache, heirate ich noch Calpurnia, die Tochter von dem römischen Senator Lucius Calpurnius Piso Caesoninus. Das mache ich aber auch nur, wie kann es anders sein, damit Calpurnias Vater die Wahl zum Konsul für das darauffolgende Jahr vereinfacht wird.

Jetzt geht's so richtig los. Novarum rerum cupidus! Ich bin neuer Dinge begierig!

Gaius Julius Caesar`,
    scientific: ``
  },
  translations: {
  "en": {
    "title": "Proconsulship",
    "excerpt": "",
    "content": {
      "diary": "Now I almost got into trouble with these \"guardians of the law\" - they actually wanted to sue ⚔️ and convict me as soon as I am a private citizen again! But they can forget that. Just because I didn't do everything exactly as it might be prescribed. But that's how it is when you have a lot of power. There are always opponents who don't want that.\n\nBut we as a triumvirate are strong and fight for that too. That's why Pompey and Crassus helped me so that it doesn't come to that in the first place. That's why I'm still here - and report with joy that I have become Proconsul. A Proconsul is a Roman governor who is in office for a year and represents the Consul in the provinces. In any case, I am now Proconsul for five years for the time being - now I have to show what I can do. 🌍My territories are quite large this time (today's Netherlands, France and Belgium) - from Illyria to Gallia Cisalpina and Gallia Transalpina. That means I can wage great wars of conquest, and the Senate must forgive me - because I am the only true leader of Rome!\n\nBut before I set off for Gaul, I am marrying Calpurnia - the daughter of the Roman Senator Lucius Calpurnius Piso Caesoninus. But I only do that - how could it be otherwise - so that Calpurnia's father's election as consul for the following year is simplified.\n\nNow it really starts:\n\nNovarum rerum cupidus!\n\nI am eager for new things!\n\nGaius Julius Caesar",
      "scientific": ""
    }
  },
  "la": {
    "title": "Proconsulatus",
    "excerpt": "",
    "content": {
      "diary": "Nunc paene in turbas incidi cum his \"custodibus legis\" - re vera me accusare ⚔️ et damnare volebant, simulac iterum privatus essem! Sed hoc oblivisci possunt. Tantum quia non omnia feci sicut fortasse praescriptum est. Sed sic est cum multam potestatem habes. Semper sunt adversarii qui hoc nolunt.\n\nSed nos ut triumviratus fortes sumus et pro hoc etiam pugnamus. Ideo Pompeius et Crassus mihi adfuerunt ne hoc omnino accideret. Ideo adhuc hic sum - et cum gaudio nuntio me Proconsulem factum esse. Proconsul est gubernator Romanus qui per unum annum in officio est et consulem in provinciis repraesentat. In omni casu nunc pro tempore quinque annos Proconsul sum - nunc ostendere debeo quid possim. 🌍Territoria mea hoc tempore satis magna sunt (hodie Nederlandia, Francia et Belgica) - ab Illyrico ad Galliam Cisalpinam et Galliam Transalpinam. Hoc significat me magna bella expugnationis gerere posse, et Senatus mihi ignoscere debet - quia ego sum solus verus dux Romae!\n\nSed antequam in Galliam proficiscar, Calpurniam duco - filiam senatoris Romani Lucii Calpurnii Pisonis Caesonini. Hoc autem tantum facio - quomodo aliter esse posset - ut patri Calpurniae electio in consulatum anni sequentis facilior reddatur.\n\nNunc vere incipit:\n\nNovarum rerum cupidus!\n\nGaius Iulius Caesar",
      "scientific": ""
    }
  }
}
};

export default post;
