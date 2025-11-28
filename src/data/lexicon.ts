import { posts } from "./posts";

export interface LexiconEntry {
  term: string;
  slug: string;
  definition: string;
  category: 'Politik' | 'Militär' | 'Gesellschaft' | 'Recht' | 'Philosophie';
  etymology?: string;
  relatedTerms?: string[]; // slugs
}

export const lexicon: LexiconEntry[] = [
  {
    term: "Senat",
    slug: "senat",
    definition: "Der Römische Senat (lateinisch Senatus) war die wichtigste und beständigste politische Institution der römischen Antike. Seine Mitglieder, die Senatoren, entstammten zumeist den vornehmsten Familien Roms. In der Republik war der Senat formal nur ein beratendes Gremium, de facto jedoch das Machtzentrum. Im Kaiserreich verlor er an Einfluss, blieb aber ein Symbol für die römische Tradition.",
    category: "Politik",
    etymology: "Von lat. 'senex' (alter Mann), also 'Rat der Ältesten'.",
    relatedTerms: ["konsul", "republik", "magistrat"],
  },
  {
    term: "Konsul",
    slug: "konsul",
    definition: "Die beiden Konsuln waren die höchsten zivilen und militärischen Beamten (Magistrate) der Römischen Republik. Sie wurden jährlich vom Volk gewählt und übten ihr Amt kollegial aus, wobei jeder Konsul ein Veto-Recht gegen die Entscheidungen des anderen hatte. Sie führten den Vorsitz im Senat und befehligten die Legionen.",
    category: "Politik",
    etymology: "Von lat. 'consulere' (beraten).",
    relatedTerms: ["senat", "republik", "magistrat", "prätor"],
  },
  {
    term: "Republik",
    slug: "republik",
    definition: "Die Römische Republik (ca. 509–27 v. Chr.) war die Phase der antiken römischen Zivilisation, die durch eine republikanische Regierungsform gekennzeichnet war. An die Stelle eines Königs traten jährlich gewählte Magistrate. Die Macht war zwischen dem Senat, den Magistraten und den Volksversammlungen (Comitia) aufgeteilt.",
    category: "Politik",
    etymology: "Von lat. 'res publica' (öffentliche Sache).",
    relatedTerms: ["senat", "konsul", "volkstribun"],
  },
  {
    term: "Diktator",
    slug: "diktator",
    definition: "In der Römischen Republik ein außerordentliches Amt mit unbeschränkter Befehlsgewalt (imperium), das in Notzeiten auf Beschluss des Senats für maximal sechs Monate ernannt wurde, um eine spezifische Krise zu bewältigen. Gaius Iulius Caesar ließ sich später zum 'Dictator perpetuo' (Diktator auf Lebenszeit) ernennen, was einen Bruch mit der Tradition darstellte.",
    category: "Politik",
    etymology: "Von lat. 'dictare' (diktieren, befehlen).",
    relatedTerms: ["caesar", "sulla", "imperium"],
  },
  {
    term: "Triumvirat",
    slug: "triumvirat",
    definition: "Ein politisches Bündnis von drei einflussreichen Männern (Drei-Männer-Kollegium), die sich die Macht im Staat teilten. Das Erste Triumvirat (ca. 60 v. Chr.) war ein informelles Bündnis zwischen Caesar, Pompeius und Crassus. Das Zweite Triumvirat (43 v. Chr.) zwischen Octavian, Marcus Antonius und Lepidus war hingegen ein staatlich legitimiertes Amt.",
    category: "Politik",
    etymology: "Von lat. 'tres viri' (drei Männer).",
    relatedTerms: ["caesar", "augustus", "cicero"],
  },
  {
    term: "Proskription",
    slug: "proskription",
    definition: "Die öffentliche Ächtung und Vogelfreierklärung von politischen Gegnern, meist durch Aushang von Namenslisten. Die Geächteten verloren ihre Bürgerrechte und ihr Vermögen wurde konfisziert. Für ihre Tötung wurde oft eine Belohnung ausgesetzt. Sulla und das Zweite Triumvirat nutzten dieses Mittel exzessiv.",
    category: "Recht",
    etymology: "Von lat. 'proscribere' (öffentlich anschreiben).",
    relatedTerms: ["sulla", "cicero", "triumvirat"],
  },
  {
    term: "Legion",
    slug: "legion",
    definition: "Die größte taktische Einheit der römischen Armee. Eine Legion zur Zeit der späten Republik und frühen Kaiserzeit bestand aus etwa 4.800 schwer bewaffneten Infanteristen (Legionären) sowie einer kleinen Reitereiabteilung. Sie war in 10 Kohorten zu je 6 Centurien unterteilt.",
    category: "Militär",
    etymology: "Von lat. 'legere' (auswählen, ausheben).",
    relatedTerms: ["centurio", "kohorte", "imperium"],
  },
  {
    term: "Stoa",
    slug: "stoa",
    definition: "Eine einflussreiche philosophische Schule der Antike, gegründet von Zenon von Kition. Die Stoiker lehrten, dass Tugend, die im Einklang mit der Natur und der Vernunft (Logos) steht, das höchste Gut sei. Emotionen (Leidenschaften) gelten als Störungen, die durch Vernunft zu überwinden sind. Gleichmut (Apatheia) und Pflichtbewusstsein sind zentrale Ideale. Seneca war ein bedeutender Vertreter der jüngeren römischen Stoa.",
    category: "Philosophie",
    etymology: "Nach der 'Stoa poikile' (bemalte Vorhalle) in Athen, dem ersten Versammlungsort der Schule.",
    relatedTerms: ["seneca", "philosophie", "epiktet"],
  },
  {
    term: "Pontifex Maximus",
    slug: "pontifex-maximus",
    definition: "Der oberste Priester im alten Rom und das Oberhaupt des Kollegiums der Pontifices, des wichtigsten Priestergremiums. Ein hochangesehenes und einflussreiches Amt auf Lebenszeit, das sowohl religiöse als auch politische Bedeutung hatte. Caesar und Augustus bekleideten dieses Amt.",
    category: "Gesellschaft",
    etymology: "Bedeutung umstritten, evtl. 'Brückenbauer' (pons + facere).",
    relatedTerms: ["caesar", "augustus", "religion"],
  },
  {
    term: "Magistrat",
    slug: "magistrat",
    definition: "Ein gewählter, politischer Amtsträger in der Römischen Republik. Magistrate übten exekutive, legislative oder judikative Gewalt aus. Die Ämterlaufbahn (cursus honorum) regelte die Abfolge der Ämter, z.B. Quästor, Ädil, Prätor, Konsul. Die meisten Ämter waren auf ein Jahr befristet und wurden kollegial besetzt.",
    category: "Politik",
    relatedTerms: ["konsul", "prätor", "cursus-honorum"],
  },
  {
    term: "Prätor",
    slug: "prätor",
    definition: "Ein hoher Magistrat in der Römischen Republik, im Rang direkt unter dem Konsul. Die Hauptaufgabe der Prätoren war die Rechtsprechung in Rom. Nach ihrem Amtsjahr übernahmen sie oft als Proprätor die Verwaltung einer Provinz.",
    category: "Recht",
    relatedTerms: ["konsul", "magistrat", "cursus-honorum"],
  },
  {
    term: "Volkstribun",
    slug: "volkstribun",
    definition: "Ein Amt in der Römischen Republik, das geschaffen wurde, um die Interessen der Plebejer (des einfachen Volkes) gegen die der Patrizier (des Adels) zu vertreten. Volkstribunen besaßen weitreichende Befugnisse, insbesondere das Vetorecht (intercessio) gegen Maßnahmen aller anderen Magistrate.",
    category: "Politik",
    relatedTerms: ["plebejer", "republik", "senat"],
  },
   {
    term: "Imperium",
    slug: "imperium",
    definition: "Die höchste, unbeschränkte Befehlsgewalt im militärischen und zivilen Bereich. In der Republik wurde sie den höchsten Magistraten (Konsuln, Prätoren, Diktatoren) verliehen. Das Imperium umfasste das Recht, Truppen auszuheben und zu befehligen, Recht zu sprechen und die Auspizien (göttliche Vorzeichen) zu beobachten.",
    category: "Militär",
    relatedTerms: ["konsul", "prätor", "diktator"],
  },
  {
    term: "Cursus honorum",
    slug: "cursus-honorum",
    definition: "Die traditionelle Ämterlaufbahn für römische Senatoren. Sie legte eine feste Reihenfolge von militärischen und zivilen Ämtern fest, die ein aufstrebender Politiker durchlaufen musste, um zum Konsulat, dem höchsten Amt, zu gelangen. Typische Stationen waren Quästur, Ädilität, Prätur und Konsulat.",
    category: "Politik",
    relatedTerms: ["magistrat", "konsul", "senat"],
  },
  {
    term: "Philosophie",
    slug: "philosophie",
    definition: "Das Streben nach Weisheit und Erkenntnis über die grundlegenden Fragen der Welt und der menschlichen Existenz. In Rom waren vor allem die griechischen Schulen der Stoa, des Epikureismus und der Akademie (Skeptizismus) von Bedeutung. Cicero und Seneca waren maßgeblich daran beteiligt, die griechische Philosophie in die lateinische Sprache und Kultur zu übertragen.",
    category: "Philosophie",
    relatedTerms: ["stoa", "cicero", "seneca"],
  }
];
