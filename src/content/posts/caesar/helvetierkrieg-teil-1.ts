import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '8',
  slug: 'helvetierkrieg-teil-1',
  author: 'caesar',
  title: 'Helvetierkrieg – Teil 1',
  
  excerpt: '',
  historicalDate: '57 v. Chr.',
  historicalYear: -57,
  date: new Date().toISOString().split('T')[0],
  readingTime: 1,
  tags: ["Barbaren","Gallien","Feind","Helvetier"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/kkg_system_36041_Casars_macht_in_seinem_ersten_Prokonsul_uber_G_a27d6805-f00b-4f98-81f5-279c5b8e6a051.png',
  content: {
    diary: `Ihr habt doch bestimmt schon mal von den Barbaren und Galliern gehört. Öffentlich darf ich das nicht sagen, dann werde ich ja sofort wieder angezeigt oder noch schlimmer: bei der Diskriminierungsmeldestelle gemeldet, aber hier traue ich mich einfach. Ich lass mich nicht unterkriegen! Die Gallier und Barbaren sind echt barbarisch. Solche ungehobelten Kerle habt ihr noch nie gesehen. Ich finde, dass sind sogar mehr Tiere als Menschen. Die haben noch nie ein vernünftiges Wort gesprochen oder eine Straße gesehen, sondern leben in Wäldern und bekriegen sich als Freizeitbeschäftigung. Die sind so abseits von unserer Provinz, dass teils gar keine Händler zu diesen vordringen.

Eine Gruppe unter ihnen ist besonders schlimm: Die Helvetier. Gegen die sind die oben geschilderten Stämme reine Kaninchen. Ich wage es nicht, diese genauer zu beschreiben, aber ein Wort trifft es ganz gut: Grauenvoll.

Das wäre an sich nicht so schlimm, aber jetzt hat der Anführer dieser unzivilisierten Gruppe seine Schergen zu mir geschickt und diese verlangen unter Gewaltandrohung, durch mein Gebiet zu ziehen, um Krieg zu führen.

Da sie behauptet haben, sie hätten keinen anderen Weg, was nicht stimmt, ist die Sachlage ganz klar: Diese unehrlichen Feinde unserer Republik wollen meine Gebiete angreifen.

Ich weiß noch nicht, was ich machen soll, aber sicher ist: Ich muss handeln und unsere Mitbürger schützen. Mir ist Volksnähe sehr wichtig, deswegen schreibt gerne mal in die Kommentare, wie ich vorgehen soll.

Ich werde nicht zulassen, dass diese Tiere unsere zivilisierte Gesellschaft unterwandern!

Es ist besser, ein für allemal zu sterben, als in dauernder Erwartung des Todes zu leben.

Gaius Julius Caesar

Damit Ihr diese Erfahrung nicht machen müsst, werde ich euch davor beschützen. Auf mich und meine Erfolge!`,
    scientific: ``
  },
  translations: {
  "en": {
    "title": "Helvetian War - Part 1",
    "excerpt": "",
    "content": {
      "diary": "Surely you have heard of the barbarians🐺 and Gauls 🦍. I'm not allowed to say that publicly, then I'll immediately be reported again or even worse: reported to the discrimination reporting office, but here I simply dare. I won't let myself be defeated! The Gauls and barbarians are truly - as the name says - barbaric. You have never seen such uncouth fellows. I think they are even more animals than humans. They have never spoken a sensible word or seen a street, but live in forests 🏡and wage war as a leisure activity. They are so far away from our province that sometimes no traders reach them at all.\n\nOne group among them is particularly bad: The Helvetii. Compared to them, the tribes described above are pure rabbits. I dare not describe them more closely, but one word fits it quite well: \"Horrible\".\n\nThat wouldn't be so bad in itself, but now the leader of this uncivilized group has sent his henchmen to me and they demand - under threat of violence, to pass through my territory to wage war.\n\nSince they claimed they had no other way - which is not true, the situation is quite clear: These dishonest enemies of our republic want to attack my territories.\n\nI don't know what to do yet, but one thing is certain: I must act and protect our fellow citizens.\n\nProximity to the people is very important to me, so feel free to write in the comments how I should proceed.\n\nI will not allow these \"animals\" to infiltrate our civilized society!\n\nIt is better to die once and for all than to live in constant expectation of death.\n\nGaius Julius Caesar\nSo that you do not have to have this experience, I will protect you from it.\n\n🥂To me and my successes!",
      "scientific": ""
    }
  },
  "la": {
    "title": "Bellum Helveticum - Pars I",
    "excerpt": "",
    "content": {
      "diary": "Certe iam audivistis de barbaris🐺 et Gallis 🦍. Publice hoc dicere non licet, statim iterum accusabor aut peius: ad magistratum discriminationis deferar, sed hic simpliciter audeo. Non me vinci patiar! Galli et barbari sunt vere - ut nomen dicit - barbari. Tales homines incultos numquam vidistis. Puto eos plus bestias esse quam homines. Numquam verbum sensibile locuti sunt nec viam viderunt, sed in silvis 🏡vivunt et bellum gerunt pro otio. Tam procul a provincia nostra sunt ut interdum nulli mercatores ad eos perveniant.\n\nUna gens inter eos maxime mala est: Helvetii. Prae his tribus supra descriptae sunt puri cuniculi. Non audeo eos accuratius describere, sed unum verbum bene convenit: \"Horribile\".\n\nHoc per se non tam malum esset, sed nunc dux huius gregis inculti satellites suos ad me misit et hi postulant - sub minatione violentiae, ut per fines meos transeant ad bellum gerendum.\n\nCum affirmaverint se nullam aliam viam habere - quod verum non est, res est valde clara: Hi inimici inhonesti rei publicae nostrae fines meos oppugnare volunt.\n\nNondum scio quid faciam, sed certum est: Agendum est mihi et cives nostros protegendum.\n\nPopularitas mihi maximi momenti est, ideo scribite libenter in commentariis quomodo procedam.\n\nNon patiar has \"bestias\" societatem nostram civilem subruere!\n\nPraestat semel mori quam in perpetua expectatione mortis vivere.\n\nGaius Iulius Caesar\nNe hanc experientiam habere debeatis, vos ab ea protegam.\n\n🥂Mihi et successibus meis!",
      "scientific": ""
    }
  }
}
};

export default post;
