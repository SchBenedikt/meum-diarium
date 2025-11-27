export type Author = {
  id: string;
  name: string;
  initials: string;
  bio: string;
};

export type Post = {
  id: string;
  authorId: string;
  type: "diary" | "scientific";
  title: string;
  date: string;
  imageId: string;
  excerpt: string;
};

export const authors: Author[] = [
  {
    id: "caesar",
    name: "Gaius Julius Caesar",
    initials: "JC",
    bio: "Diktator auf Lebenszeit, Pontifex Maximus, Imperator und Literat. Chronist meiner Feldzüge und politischer Manöver in Rom.",
  },
  {
    id: "cicero",
    name: "Marcus Tullius Cicero",
    initials: "MC",
    bio: "Konsul, Redner, Philosoph und überzeugter Verteidiger der Republik. Dokumentiert meine Gedanken zu Recht, Rhetorik und dem prekären Zustand unseres Staates.",
  },
];

export const posts: Post[] = [
  {
    id: "post1",
    authorId: "caesar",
    type: "diary",
    title: "Die Würfel sind gefallen",
    date: "10. Januar 49 v. Chr.",
    imageId: "crossing-rubicon",
    excerpt:
      "Heute führte ich die 13. Legion über den Rubikon. Ein kleiner Fluss, der doch die Grenze zwischen meiner Provinz und Italien markiert. Es gibt kein Zurück mehr. Alea iacta est.",
  },
  {
    id: "post2",
    authorId: "caesar",
    type: "scientific",
    title: "Über die Ingenieurskunst der Rheinbrücke",
    date: "55 v. Chr.",
    imageId: "roman-aqueduct",
    excerpt:
      "Ein technischer Bericht über den Bau einer hölzernen Behelfsbrücke über den Rhein. Das in zehn Tagen vollendete Werk war eine Demonstration römischer Ingenieurskunst und erleichterte den Übergang der Legionen in germanisches Gebiet.",
  },
  {
    id: "post3",
    authorId: "caesar",
    type: "diary",
    title: "Sieg bei Alesia",
    date: "2. Oktober 52 v. Chr.",
    imageId: "gaul-battle",
    excerpt:
      "Vercingetorix hat kapituliert. Der gallische Häuptling, einst ein gewaltiger Gegner, legte seine Waffen zu meinen Füßen nieder. Dieser Sieg markiert das Ende der Gallischen Kriege. Ein Triumph für Rom und für mich.",
  },
  {
    id: "post4",
    authorId: "cicero",
    type: "diary",
    title: "Eine Verschwörung aufgedeckt",
    date: "8. November 63 v. Chr.",
    imageId: "roman-senate",
    excerpt:
      "Ich habe meine erste Rede gegen Catilina im Senat gehalten. Die Dreistigkeit des Mannes, unter uns zu erscheinen, während sein Komplott zum Sturz der Republik bekannt ist! Die Stadt hält den Atem an.",
  },
  {
    id: "post5",
    authorId: "cicero",
    type: "scientific",
    title: "De Re Publica: Über den idealen Staat",
    date: "ca. 51 v. Chr.",
    imageId: "roman-forum",
    excerpt:
      "Eine Untersuchung der besten Regierungsform, die die römische Verfassung als Vorbild heranzieht. Eine gemischte Verfassung, die Monarchie, Aristokratie und Demokratie ausbalanciert, wird als das stabilste und gerechteste System vorgeschlagen.",
  },
  {
    id: "post6",
    authorId: "cicero",
    type: "diary",
    title: "Klage des Exilanten",
    date: "März, 58 v. Chr.",
    imageId: "library-of-alexandria",
    excerpt:
      "Vertrieben aus meinem Zuhause, meiner Stadt, meinem Lebenswerk. Dieses Exil ist eine bittere Pille, eine Belohnung für meine Hingabe an die Republik. Trost finde ich nur in der Philosophie und den Briefen, die ich an Atticus sende.",
  },
    {
    id: "post7",
    authorId: "caesar",
    type: "diary",
    title: "Iden des März",
    date: "15. März 44 v. Chr.",
    imageId: "caesar-bust",
    excerpt:
      "Ein seltsames Gefühl der Vorahnung heute Morgen. Calpurnias Träume waren unruhig. Der Senat tritt heute zusammen. Et tu, Brute? Der Gedanke ist ein flüchtiger Schatten. Ich muss gehen.",
  },
   {
    id: "post8",
    authorId: "cicero",
    type: "diary",
    title: "Über Caesars Ermordung",
    date: "16. März 44 v. Chr.",
    imageId: "cicero-bust",
    excerpt:
      "Der Tyrann ist tot. Ein Tag der Befreiung für die Republik! Doch die Zukunft ist ungewiss. Die Stadt ist ein Pulverfass, und ich fürchte, was Antonius' Ehrgeiz entfachen mag.",
  },
];
