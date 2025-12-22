import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '1',
  slug: 'de-me',
  author: 'caesar',
  title: 'De me',
  diaryTitle: 'Wer bin ich? Gaius Julius Caesar!',
  scientificTitle: 'Gaius Julius Caesar: Biographische Einordnung',
  
  excerpt: 'Über meine Person, Gaius Julius Caesar',
  historicalDate: '100 v. Chr.',
  historicalYear: -100,
  date: new Date().toISOString().split('T')[0],
  readingTime: 3,
  tags: [],
  coverImage: '/images/post-default.jpg',
  content: {
    diary: `Salvete! Seid gegrüßt!

Ich bin Gaius Julius Caesar, geboren im Jahr 100 v. Chr. in eine patrizische Familie, die ihre Abstammung auf die Göttin Venus und den trojanischen Helden Aeneas zurückführt. Mein vollständiger Name ist Gaius Iulius Caesar, und ich trage ihn mit Stolz, denn er verbindet mich mit den ältesten und vornehmsten Geschlechtern Roms.

Dieses Tagebuch, mein Diarium, soll meine Taten für die Nachwelt festhalten. Ich habe bereits sieben Bücher über den Gallischen Krieg verfasst, De Bello Gallico, in denen ich meine Feldzüge gegen die barbarischen Stämme jenseits der Alpen dokumentiert habe. Diese Commentarii sind nicht nur militärische Berichte, sondern auch politische Rechtfertigungen meines Handelns gegenüber dem römischen Senat und Volk.

Warum schreibe ich in der dritten Person über mich selbst? Dies ist der Stil eines römischen Feldherrn und Staatsmanns. Es verleiht meinen Worten Objektivität und Autorität. Caesar spricht über Caesar, als würde ein Historiker über vergangene Ereignisse berichten, obwohl ich selbst der Handelnde bin.

Meine Familie mag alt und ehrwürdig sein, aber wir waren nie besonders reich oder politisch einflussreich. Mein Onkel Gaius Marius war einer der größten Generäle Roms, doch seine popularen Reformen brachten unsere Familie in Konflikt mit der optimatischen Elite. Durch geschickte Heiratspolitik, Bündnisse und vor allem durch militärische Erfolge habe ich die Position der Julier wieder gestärkt.

In meiner Jugend wurde ich von den Optimaten verfolgt. Sulla, der Diktator, forderte, dass ich mich von meiner Frau Cornelia, der Tochter des Cinna, scheiden sollte. Ich weigerte mich und musste fliehen. Später wurde ich begnadigt, aber Sulla soll gesagt haben: "In diesem jungen Mann stecken viele Mariusse." Er erkannte in mir eine Bedrohung für die alte Ordnung.

Ich bin nicht nur ein Soldat. Ich bin Redner, Schriftsteller, Pontifex Maximus, Konsul, Prokonsul, und bald werde ich noch mehr sein. Meine Clementia, meine Milde gegenüber besiegten Feinden, unterscheidet mich von früheren Machthabern. Wo Sulla seine Gegner durch Proskriptionen ermorden ließ, biete ich Vergebung an.

Dieses Tagebuch wird meine Gedanken, meine Pläne und meine Rechtfertigungen enthalten. Die Geschichte wird von den Siegern geschrieben, und ich bin entschlossen, nicht nur zu siegen, sondern auch meine eigene Geschichte zu erzählen.

Gaius Julius Caesar
Pontifex Maximus, Konsul der Römischen Republik`,
    scientific: `## Biographische Grundlagen zu Gaius Julius Caesar

Gaius Julius Caesar (100-44 v. Chr.) gilt als eine der bedeutendsten Persönlichkeiten der römischen Geschichte und der Weltgeschichte überhaupt. Seine politische und militärische Karriere markiert den Übergang von der römischen Republik zum Prinzipatssystem, das später als römisches Kaiserreich bekannt wurde.

### Herkunft und frühe Jahre
diaryTitle": "Who am I? Gaius Julius Caesar!",
    "scientificTitle": "Gaius Julius Caesar: Biographical Classification",
    "
Caesar entstammte der patrizischen gens Iulia, die ihre Abstammung mythologisch auf die Göttin Venus und den trojanischen Helden Aeneas zurückführte. Trotz dieser noblen Herkunft war die Familie politisch und wirtschaftlich nicht zur Elite zu rechnen. Sein Onkel Gaius Marius, ein popularer Reformer und Feldherr, prägte die politische Ausrichtung der Familie nachhaltig.

### Politische Positionierung

In der ausgehenden Republik stand Caesar der popularen Partei nahe, die sich für die Interessen der plebs und der Ritterschaft einsetzte, im Gegensatz zu den Optimaten, die die Senatsherrschaft verteidigten. Diese Positionierung brachte ihn früh in Konflikt mit Sulla, dem optimatischen Diktator, der Caesar zur Scheidung von seiner Frau Cornelia zwingen wollte. Caesars Weigerung führte zu seiner Flucht und späteren Begnadigung.
diaryTitle": "Quis sum? Gaius Iulius Caesar!",
    "scientificTitle": "Gaius Iulius Caesar: Collocatio biographica",
    "
### Literarische Selbstdarstellung

Caesars Commentarii, insbesondere "De Bello Gallico", sind nicht nur militärhistorische Quellen, sondern auch politische Rechtfertigungsschriften. Die Verwendung der dritten Person verleiht seinen Berichten einen Anschein von Objektivität, während sie faktisch der Selbstlegitimation dienen. Diese literarische Technik war innovativ und beeinflusste die historiographische Tradition nachhaltig.

### Clementia Caesaris

Ein zentrales Element von Caesars Selbstdarstellung war seine clementia (Milde) gegenüber besiegten Gegnern. Im Gegensatz zu Sullas Proskriptionen bot Caesar Vergebung an, was ihm politisches Kapital einbrachte, aber auch als Herrschaftsinstrument interpretiert werden kann, das Abhängigkeiten schuf.

### Historiographische Bedeutung

Caesars Schriften sind Primärquellen ersten Ranges, müssen aber quellenkritisch gelesen werden, da sie der Selbstdarstellung dienen. Die moderne Forschung betont den propagandistischen Charakter seiner Werke, ohne ihren dokumentarischen Wert zu schmälern.`
  },
  translations: {
  "en": {
    "title": "De me",
    "excerpt": "About me, Gaius Julius Caesar",
    "content": {
      "diary": "**Salvete! Greetings to my blog!**\n\nI am Gaius Julius Caesar; arguably the best general in Rome's history. My subjects are very grateful to me for how much laborious work I do for them.\n\nThese stories are what this is all about. My life's work; the 7 books \"De Bello Gallico\" (I didn't write one; but I have to say I almost like mine better anyway) are already so old that many can't even remember them anymore: That means they also don't meet the latest standards. Because nowadays every personality has their own website - except maybe this new-modern rich Elon Musk, who nobody likes anyway. But at least he knows Latin and remembers me! He probably wants to be exactly like me. But he'll never manage that! - Although - If he wants to fight Mark Zuckerberg gladiator-style anyway, then he sees me as a great leader and he is the inferior slave! That's why I already have the title \"Kaiser\" (Emperor) in my name; because I am simply the most powerful!\n\nUnfortunately, it takes a while for this bird chirping (new-modern also called tweet somehow) to load here.\n\nI hate these foreign barbarian words - they just don't make sense - if only because I didn't invent them!\n\nHe probably just copied the saying above too! And he doesn't even have the right to use my name! For my name must be revered!\n\nBut in the end he didn't want to fight - he's just soft - we call that \"effeminare\". Because he was probably afraid that Mark would get help from me - because he admits that he learned Latin and loves Roman history and culture.\n\nBut back to the topic: As already mentioned, every personality also has their own website or blog. And now I have received one too. I don't know much about it - Elon probably doesn't either; he only thinks about his burning electric donkeys. But I have good connections and came across Vinzenz and Benedikt, who agreed to provide me with this website for free so that I can publish my life story! The two just wanted the stories to be quite exciting and interesting so that they get quite a lot of visitors. Hence these funny comparisons with Elon. They are funny, aren't they? Such a wannabe....\n\nSo. This is now my blog where I have quite a lot to do until I have visitors from all over the world here on the website. That's why I would also be happy about many comments; because I as a scholar know Latin and Greek and much more - the barbarians in contrast to us don't have a real language - and will therefore also answer every comment.\n\nSince I am more modern than Elon and also have my own blog, I have immediately become so modern that my blog can also be accessed offline. At least that's what my two admins told me - what the difference is or what should happen then, I don't know yet either. Best you try it!\n\nBut that's all from my side for now.\n\nHave fun reading wishes you\n\nGaius Julius Caesar",
      "scientific": ""
    }
  },
  "la": {
    "title": "De me",
    "excerpt": "De persona mea, Gaius Iulius Caesar",
    "content": {
      "diary": "**Salvete! In blogo meo!**\n\nEgo sum Gaius Iulius Caesar; fortasse optimus imperator historiae Romanae. Subiecti mei mihi gratias maximas agunt, quantam operam laboriosam pro eis praestem.\n\nDe his historiis hic agetur. Opus vitae meae; libri VII \"De Bello Gallico\" (unum non scripsi; sed dicere debeo meos paene meliores mihi videri) iam tam vetusti sunt ut multi eorum vix meminisse possint: Hoc est, signis recentissimis non respondent. Nam hodie omnis persona propriam paginam interretialem habet - praeter fortasse hunc novum divitem Elon Musk, quem nemo amat. Sed saltem Latine scit et mei meminit! Probabiliter vult esse sicut ego. Sed hoc numquam perficiet! - Quamquam - Si more gladiatorio cum Marco Zuckerberg pugnare vult, tum me ut ducem magnum videt et ipse est servus inferior! Ideo in nomine meo titulum \"Caesar\" habeo; quia simpliciter potentissimus sum!\n\nInfeliciter paulum durat, donec garritus avium (novo modo tweet vocatus) hic oneretur.\n\nOdi haec verba barbara peregrina - sensum non habent - vel ideo quia ego ea non inveni!\n\nIllud dictum supra certe etiam tantum transcripsit! Et ne ius quidem habet nomine meo uti! Nam nomen meum venerandum est!\n\nSed tandem pugnare noluit - est simpliciter mollitus - \"effeminare\" hoc vocamus. Nam probabiliter timuit ne Marcus auxilium a me peteret - nam fatetur se Latine didicisse et historiam culturamque Romanam amare.\n\nSed ad rem: Ut iam dictum est, omnis persona propriam paginam vel blogum habet. Et hanc nunc ego quoque accepi. Non multum de hoc scio - Elon probabiliter nec; cogitat tantum de asinis suis electricis ardentibus. Sed bonas conexiones habeo et inveni Vincentium et Benedictum, qui consenserunt hanc paginam mihi gratis praebere, ut historiam vitae meae publicare possim! Hi duo tantum volebant historias satis excitantes et iucundas esse, ut multos visitatores acciperent. Ideo etiam hae comparationes ridiculae cum Elon. Sunt ridiculae, nonne? Talis simulator....\n\nSic. Hoc est nunc blogum meum in quo multum facere habeo, donec visitatores ex toto orbe terrarum hic in pagina habeam. Ideo gauderem multis commentariis; nam ego ut doctus Latine et Graece et multo plura scio - barbari contra nos linguam veram non habent - et ita cuique commentario respondebo.\n\nCum modernior sim quam Elon et etiam proprium blogum habeam, statim tam modernus factus sum ut blogum meum etiam sine interrete legi possit. Hoc saltem mihi duo administratores mei dixerunt - quid discrimen sit vel quid tum accidere debeat, nondum scio. Optime tempta!\n\nSed hoc nunc a me dictum sit.\n\nMultam voluptatem legendi vobis optat\n\nGaius Iulius Caesar",
      "scientific": ""
    }
  }
}
};

export default post;
