import { BookOpen, Award, Lightbulb, Quote, MapPin, Swords, Users, Scroll, Target } from 'lucide-react';
export interface WorkDetail {
  slug: string;
  sections: WorkSection[];
  quotes: WorkQuote[];
  keyMoments?: KeyMoment[];
  impact: ImpactSection;
  literaryFeatures: LiteraryFeature[];
  context: ContextSection;
  bookChapters?: BookChapter[];
}
export interface WorkSection {
  icon: string;
  title: string;
  content: string[];
  type: 'context' | 'themes' | 'literary' | 'impact' | 'moments' | 'analysis';
}
export interface WorkQuote {
  latin: string;
  translation: string;
  context: string;
}
export interface KeyMoment {
  title: string;
  date: string;
  description: string;
  significance: string;
}
export interface ImpactSection {
  title: string;
  paragraphs: string[];
  highlights: string[];
}
export interface LiteraryFeature {
  title: string;
  description: string;
  examples?: string[];
}
export interface ContextSection {
  title: string;
  paragraphs: string[];
  timeline?: { year: string; event: string }[];
}
export interface BookChapter {
  number: number;
  title: string;
  description: string;
  timeframe?: string;
  keyEvents?: string[];
}
export const workDetails: Record<string, WorkDetail> = {
  'de-bello-gallico': {
    slug: 'de-bello-gallico',
    context: {
      title: 'Historischer Kontext',
      paragraphs: [
        'Das Werk entstand während und nach Caesars achtjährigem Feldzug in Gallien (58–50 v. Chr.). Es diente nicht nur als militärischer Bericht, sondern vor allem als politisches Instrument, um seine Taten in Rom zu rechtfertigen und seine Position zu stärken.',
        'Die Commentarii wurden jährlich als Rechenschaftsberichte an den Senat geschickt und sollten zeigen, dass Caesar im Interesse Roms handelte – auch wenn seine Kritiker ihm imperiale Ambitionen vorwarfen.',
        'Gallien war für Rom strategisch entscheidend: Es bot Zugang zu reichen Ressourcen, diente als Puffer gegen germanische Stämme und erweiterte das Imperium massiv nach Norden.'
      ],
      timeline: [
        { year: '58 v. Chr.', event: 'Beginn des Gallischen Krieges – Konflikt mit den Helvetiern' },
        { year: '57 v. Chr.', event: 'Unterwerfung Belgiens und der nördlichen Stämme' },
        { year: '55-54 v. Chr.', event: 'Expeditionen nach Britannien und über den Rhein' },
        { year: '52 v. Chr.', event: 'Aufstand unter Vercingetorix, Belagerung von Alesia' },
        { year: '51-50 v. Chr.', event: 'Endgültige Pazifizierung Galliens' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Literarische Bedeutung',
        content: [
          'Caesars De Bello Gallico ist ein Meisterwerk der lateinischen Prosa. Die klare, präzise Sprache macht es zum idealen Text für Lateinlernende – aber diese Einfachheit ist kalkuliert.',
          'Die Verwendung der dritten Person ("Caesar") erzeugt den Eindruck objektiver Berichterstattung, obwohl es sich um Selbstdarstellung handelt. Diese Technik verstärkt Caesars Autorität.',
          'Das Werk kombiniert militärische Berichte mit ethnographischen Beobachtungen über gallische und germanische Völker, was es zu einer wertvollen Quelle für die Frühgeschichte Europas macht.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Strategische Ziele',
        content: [
          'Politische Legitimation: Caesar musste seine kostspieligen und umstrittenen Feldzüge vor dem Senat rechtfertigen.',
          'Popularität in Rom: Die dramatischen Erzählungen von Siegen über "barbarische" Feinde machten Caesar zum Volkshelden.',
          'Wirtschaftliche Rechtfertigung: Die Eroberung brachte Gold, Sklaven und Land – materielle Beweise für den "Erfolg" seiner Mission.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Sprachliche Klarheit',
        description: 'Caesars Latein ist berühmt für seine Einfachheit und Präzision. Kurze Sätze, klare Struktur, minimale Verschachtelung – ideal für schnelle Lesbarkeit.',
        examples: [
          'Gallia est omnis divisa in partes tres – direkt, konkret, einprägsam',
          'Verwendung von Parataxe (Reihung gleichgeordneter Sätze) statt komplexer Hypotaxe'
        ]
      },
      {
        title: 'Dritte Person',
        description: 'Die Erzählung in der dritten Person ("Caesar tat dies", "Caesar entschied") schafft Distanz und suggeriert Objektivität – eine raffinierte Form der Selbst-PR.',
        examples: [
          'Statt "Ich siegte" → "Caesar siegte"',
          'Trennung zwischen Erzähler und Protagonist, obwohl beide identisch sind'
        ]
      },
      {
        title: 'Ethnographische Exkurse',
        description: 'Caesar liefert detaillierte Beschreibungen gallischer und germanischer Sitten, Religion und Gesellschaft – teilweise als erste römische Quelle.',
        examples: [
          'Beschreibung der Druiden und ihrer Rolle in der gallischen Gesellschaft',
          'Vergleiche zwischen gallischen und germanischen Stämmen',
          'Detaillierte Schilderungen von Befestigungen (oppida) und Kriegsführung'
        ]
      },
      {
        title: 'Propagandistische Rahmung',
        description: 'Jedes Detail ist sorgfältig gewählt, um Caesars Qualitäten zu unterstreichen: Mut, Strategie, Clementia (Milde) und pietas (Pflichtbewusstsein).',
        examples: [
          'Gegner werden als unzivilisiert oder treulos dargestellt',
          'Caesars Siege erscheinen als unvermeidlich und gerecht',
          'Rückschläge werden als externe Faktoren erklärt (Wetter, Verrat)'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Schlacht gegen die Helvetier',
        date: '58 v. Chr.',
        description: 'Caesars erster großer Feldzug in Gallien beginnt mit der Abwehr der wandernden Helvetier, die römisches Territorium bedrohen.',
        significance: 'Etabliert Caesar als militärischen Führer und gibt ihm den Vorwand, tiefer in Gallien vorzudringen.'
      },
      {
        title: 'Doppelbrücke über den Rhein',
        date: '55 v. Chr.',
        description: 'Caesar lässt in nur 10 Tagen eine massive Holzbrücke über den Rhein bauen – eine technische Meisterleistung.',
        significance: 'Zeigt römische Ingenieurskunst und sendet ein Signal an germanische Stämme: Rom kann überall hin.'
      },
      {
        title: 'Erste Expedition nach Britannien',
        date: '55 v. Chr.',
        description: 'Caesar überquert den Ärmelkanal und landet in Britannien – die erste römische Militärpräsenz auf der Insel.',
        significance: 'Hohes Prestige in Rom, obwohl der militärische Erfolg begrenzt war. Britannien galt als mysteriöses Land am Rand der Welt.'
      },
      {
        title: 'Belagerung von Alesia',
        date: '52 v. Chr.',
        description: 'Caesar besiegt Vercingetorix durch eine doppelte Belagerung: Innerer Wall gegen die Stadt, äußerer Wall gegen Entsatztruppen.',
        significance: 'Wendepunkt des Krieges – nach Alesia ist der gallische Widerstand gebrochen. Gilt als Meisterwerk der Belagerungstechnik.'
      },
      {
        title: 'Endgültige Unterwerfung Galliens',
        date: '51-50 v. Chr.',
        description: 'Nach der Niederlage von Vercingetorix werden die letzten Aufstände niedergeschlagen. Gallien wird römische Provinz.',
        significance: 'Caesar kehrt als reicher, mächtiger und populärer Feldherr nach Rom zurück – der Senat fürchtet ihn.'
      }
    ],
    quotes: [
      {
        latin: 'Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.',
        translation: 'Ganz Gallien ist in drei Teile geteilt, von denen den einen die Belger bewohnen, den anderen die Aquitanier, den dritten diejenigen, die in ihrer eigenen Sprache Kelten, in unserer Gallier genannt werden.',
        context: 'Der berühmte Eröffnungssatz – prägnant, informativ und sofort einprägsam. Zeigt Caesars Fähigkeit, komplexe Geographie klar darzustellen.'
      },
      {
        latin: 'Fere libenter homines id quod volunt credunt.',
        translation: 'Die Menschen glauben im Allgemeinen gerne das, was sie wollen.',
        context: 'Eine psychologische Einsicht aus Buch III – Caesar zeigt Verständnis für menschliche Natur und nutzt es strategisch.'
      },
      {
        latin: 'Consuetudo consuetudini non derogat.',
        translation: 'Eine Gewohnheit hebt die andere nicht auf.',
        context: 'Caesars Beobachtung zu kulturellen Unterschieden – relevant für seine Strategie, lokale Bräuche zu respektieren (oder auszunutzen).'
      }
    ],
    impact: {
      title: 'Wirkung & Vermächtnis',
      paragraphs: [
        'De Bello Gallico hatte weitreichende Konsequenzen: Es stärkte Caesars Position in Rom, machte ihn zum Volkshelden und legitimierte seine territorialen Eroberungen. Die Unterwerfung Galliens brachte Rom immense Reichtümer – Gold, Sklaven und strategische Kontrolle über weite Teile Europas.',
        'Das Werk beeinflusste nicht nur die römische Politik, sondern auch die europäische Geschichtsschreibung für Jahrhunderte. Es ist eine der wichtigsten Quellen für die keltische und germanische Frühgeschichte und prägte das Bild der "barbarischen" Völker im römischen Bewusstsein.',
        'Literarisch wurde De Bello Gallico zum Vorbild für klare, sachliche Prosa. Von der Renaissance bis heute dient es als Lehrbuch für Latein und als Fallstudie für militärische Strategie.'
      ],
      highlights: [
        'Über 1 Million Gallier getötet oder versklavt (nach modernen Schätzungen)',
        'Gallien wird zur reichsten römischen Provinz',
        'Caesar kehrt mit Prestige, Geld und einer loyalen Armee nach Rom zurück',
        'Das Werk etabliert einen neuen Stil der Geschichtsschreibung: nüchtern, präzise, propagandistisch effektiv'
      ]
    }
  },
  'de-bello-civili': {
    slug: 'de-bello-civili',
    context: {
      title: 'Historischer Kontext',
      paragraphs: [
        'Nach seiner Rückkehr aus Gallien 50 v. Chr. forderte der römische Senat Caesar auf, seine Legionen aufzulösen und als Privatmann nach Rom zurückzukehren. Caesar weigerte sich – er fürchtete politische Verfolgung – und überschritt stattdessen am 10. Januar 49 v. Chr. mit seinen Truppen den Rubikon, die Grenze zwischen seiner Provinz und Italien.',
        'Dieser Akt der Rebellion löste den Bürgerkrieg zwischen Caesar und den Optimaten unter Führung von Pompeius aus. De Bello Civili ist Caesars eigene Rechtfertigungsschrift für diesen Krieg.',
        'Der Bürgerkrieg war nicht nur ein militärischer Konflikt, sondern der Todeskampf der Römischen Republik. Caesar kämpfte gegen die alte senatorische Elite, die ihre Privilegien verteidigte. Am Ende stand die Alleinherrschaft.'
      ],
      timeline: [
        { year: '10. Jan 49 v. Chr.', event: 'Rubikon-Überquerung – Beginn des Bürgerkriegs' },
        { year: '49 v. Chr.', event: 'Caesar erobert Italien, Pompeius flieht nach Griechenland' },
        { year: '48 v. Chr.', event: 'Schlacht bei Pharsalos – Entscheidender Sieg über Pompeius' },
        { year: '48 v. Chr.', event: 'Pompeius\' Flucht und Ermordung in Ägypten' },
        { year: '48-47 v. Chr.', event: 'Ägyptischer Feldzug, Beziehung mit Kleopatra' }
      ]
    },
    sections: [
      {
        icon: 'Quote',
        title: 'Zentrale Themen',
        content: [
          'Dignitas: Caesar betont wiederholt, dass er für seine Ehre (dignitas) kämpft, nicht aus Machthunger. Für einen römischen Aristokraten war der Verlust von dignitas schlimmer als der Tod.',
          'Clementia: Seine Milde gegenüber besiegten Feinden wird als Zeichen moralischer Überlegenheit dargestellt. Caesar begnadigte viele Gegner – eine kalkulierte Geste.',
          'Pompeius als Verräter: Der einstige Verbündete wird als unfähig, manipulierbar und von den Optimaten missbraucht gezeigt. Caesar positioniert sich als Retter Roms vor korrupten Senatoren.'
        ],
        type: 'themes'
      },
      {
        icon: 'Award',
        title: 'Literarische Besonderheiten',
        content: [
          'Unvollendet: Das Werk bricht abrupt nach Caesars Sieg in Ägypten 48 v. Chr. ab. Vermutlich war Caesar zu beschäftigt, um es zu beenden – oder die weitere Rechtfertigung erschien unnötig, da er bereits gesiegt hatte.',
          'Persönlicher Ton: Im Vergleich zu De Bello Gallico ist De Bello Civili emotionaler. Man spürt Caesars Frustration über den Senat, seine Enttäuschung über Pompeius\' "Verrat" und seine Verzweiflung, missverstanden zu werden.',
          'Rechtfertigung: Jedes Kapitel ist darauf ausgelegt zu zeigen, dass Caesar keine Wahl hatte. Der Krieg wird als unvermeidbar dargestellt, die Schuld liegt beim Senat.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Caesars Argumentationsstrategie',
        content: [
          'Opferrolle: Caesar stellt sich als unschuldiges Opfer senatorischer Intrigen dar – er wollte nur Frieden, wurde aber gezwungen zu kämpfen.',
          'Pompeius\' Inkompetenz: Jeder Fehler des Gegners wird hervorgehoben, jede Niederlage als Beweis für moralische Schwäche gedeutet.',
          'Senat als korrupt: Die Optimaten werden als machthungrige Clique dargestellt, die das Gemeinwohl verrät.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Emotionale Färbung',
        description: 'Anders als De Bello Gallico lässt De Bello Civili mehr von Caesars Gefühlen durchscheinen. Der Leser spürt Enttäuschung, Wut und Rechtfertigungsdrang.',
        examples: [
          'Beschreibungen von Pompeius als "alter Freund, jetzt Feind"',
          'Caesars Verzweiflung über den Verrat des Senats',
          'Wiederholte Betonung, dass er "keine andere Wahl" hatte'
        ]
      },
      {
        title: 'Kürzere, direkte Sätze',
        description: 'Die Sprache ist schnörkellos und direkt – passend zum dramatischen Inhalt. Weniger ethnographische Exkurse, mehr Aktion.',
        examples: [
          'Rapide Schilderung militärischer Manöver',
          'Fokus auf politische Entscheidungen und deren Konsequenzen'
        ]
      },
      {
        title: 'Unvollständigkeit als Aussage',
        description: 'Das abrupte Ende des Werkes könnte unbeabsichtigt sein – oder eine bewusste Aussage: Nach Pharsalos war Caesars Sieg offensichtlich, weitere Rechtfertigung überflüssig.'
      }
    ],
    keyMoments: [
      {
        title: 'Rubikon-Überquerung',
        date: '10. Januar 49 v. Chr.',
        description: '»Alea iacta est« – Der Würfel ist gefallen. Caesar überschreitet mit seiner XIII. Legion den Rubikon und marschiert auf Rom.',
        significance: 'Der Moment, der die Republik beendet. Caesars Entscheidung ist illegal und unverzeihlich – aber kalkuliert. Es gibt keinen Weg zurück.'
      },
      {
        title: 'Belagerung von Brundisium',
        date: 'März 49 v. Chr.',
        description: 'Pompeius flieht mit seinen Truppen über die Adria nach Griechenland. Caesar versucht vergeblich, ihn einzukesseln.',
        significance: 'Pompeius\' Flucht zeigt seine Schwäche – aber auch seine Strategie: Er will Caesar in die Länge ziehen und aushungern.'
      },
      {
        title: 'Schlacht bei Pharsalos',
        date: '9. August 48 v. Chr.',
        description: 'Entscheidungsschlacht in Thessalien. Caesar besiegt Pompeius trotz zahlenmäßiger Unterlegenheit durch überlegene Taktik.',
        significance: 'Das Ende von Pompeius\' Macht. Nach Pharsalos ist Caesar faktisch Herrscher Roms.'
      },
      {
        title: 'Pompeius\' Tod in Ägypten',
        date: 'September 48 v. Chr.',
        description: 'Pompeius flieht nach Ägypten und wird bei der Landung ermordet – auf Befehl des jungen Pharaos Ptolemaios XIII.',
        significance: 'Caesar zeigt sich entsetzt (oder tut so) – er hätte Pompeius begnadigt. Der Tod des Rivalen ist ein PR-Desaster für Ptolemaios und ein PR-Sieg für Caesar.'
      },
      {
        title: 'Alexandrinischer Krieg',
        date: '48-47 v. Chr.',
        description: 'Caesar interveniert im ägyptischen Thronstreit und unterstützt Kleopatra VII. gegen ihren Bruder.',
        significance: 'Der Beginn von Caesars Beziehung mit Kleopatra. Ägypten wird de facto römisches Protektorat.'
      }
    ],
    quotes: [
      {
        latin: 'Alea iacta est.',
        translation: 'Der Würfel ist gefallen.',
        context: 'Caesars legendäre Worte beim Überschreiten des Rubikon. Symbolisiert den unumkehrbaren Schritt – die bewusste Entscheidung für Krieg und Rebellion.'
      },
      {
        latin: 'Pompeius iniquissimis condicionibus pacem fieri non patiebatur.',
        translation: 'Pompeius ließ unter den unfairsten Bedingungen keinen Frieden zu.',
        context: 'Caesars Darstellung der gescheiterten Verhandlungen – Pompeius wird als stur und unversöhnlich dargestellt.'
      },
      {
        latin: 'Nihil iam reliqui victoribus milites fecerunt.',
        translation: 'Die siegreichen Soldaten ließen nichts mehr übrig.',
        context: 'Beschreibung der Folgen einer Schlacht – Caesar zeigt die Härte des Krieges, ohne explizit Grausamkeit zuzugeben.'
      }
    ],
    impact: {
      title: 'Wirkung & Historische Bedeutung',
      paragraphs: [
        'De Bello Civili ist weniger ein militärisches Handbuch als eine politische Verteidigungsschrift. Caesar versucht, die Nachwelt davon zu überzeugen, dass er keine Wahl hatte – dass der Bürgerkrieg vom Senat provoziert wurde.',
        'Historisch dokumentiert das Werk den Niedergang der römischen Republik. Es zeigt nicht nur militärische Ereignisse, sondern auch die politischen und moralischen Konflikte, die zur Alleinherrschaft führten.',
        'Das Werk ist heute eine Primärquelle für das späte 1. Jahrhundert v. Chr. und bietet Einblicke in römische Militärlogistik, Strategie und die politischen Lager der Zeit. Trotz Caesars offensichtlicher Voreingenommenheit ist es ein unverzichtbares Dokument.'
      ],
      highlights: [
        'Zeigt den Todeskampf der Römischen Republik aus der Sicht des Siegers',
        'Rechtfertigt Caesars Weg zur Alleinherrschaft – mit begrenztem Erfolg',
        'Unvollständig, aber gerade deshalb faszinierend: Was hätte Caesar noch geschrieben?',
        'Einfluss auf spätere Rechtfertigungsschriften von Machthabern'
      ]
    }
  },
  'in-catilinam': {
    slug: 'in-catilinam',
    context: {
      title: 'Historischer Kontext',
      paragraphs: [
        'Im Herbst 63 v. Chr. versuchte der verschuldete Aristokrat Lucius Sergius Catilina mit einer Verschwörergruppe, Rom zu besetzen und die bestehende Ordnung zu stürzen. Seine Anhänger waren teilweise Veteranen, teilweise arme Stadtbewohner, vermutlich auch Sklaven.',
        'Cicero, als amtierender Konsul, entdeckte die Verschwörung durch seine Spione und brachte Catilina dazu, Rom zu verlassen. In der Senatssitzung vom 8. November 63 v. Chr. konfrontierte Cicero Catilina – dieser war selbst im Senat anwesend – und zwang ihn, Rom zu verlassen.',
        'Die Catilinarischen Reden sind Ciceros Bericht dieser Ereignisse und eine Darstellung der aufgedeckten Verschwörung. Sie machten Cicero zum berühmtesten Redner seiner Zeit – «pater patriae» (Vater des Vaterlandes).'
      ],
      timeline: [
        { year: 'Sommer 63 v. Chr.', event: 'Catilinas geheime Verschwörung nimmt Gestalt an' },
        { year: '8. November 63 v. Chr.', event: 'Ciceros erste Rede gegen Catilina im Senat' },
        { year: 'November 63 v. Chr.', event: 'Catilina flieht aus Rom, seine Mitverschwörer werden verhaftet' },
        { year: 'Dezember 63 v. Chr.', event: 'Ciceros Reden II-IV; Todesurteile gegen die Verschwörer' },
        { year: '62 v. Chr.', event: 'Catilina stirbt in der Schlacht bei Pistoia' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Literarische Merkmale',
        content: [
          'Die erste Rede ist dramatisch: Cicero konfrontiert Catilina direkt im Senat mit den Worten »Quo usque tandem abutere, Catilina, patientia nostra?« (Wie lange noch, Catilina, wirst du unsere Geduld missbrauchen?)',
          'Die Reden kombinieren präzise Argumentation mit emotionalen Appellen. Cicero nutzt Anaphora (Wiederholung), Alliteration und antithetische Strukturen für maximale Wirkung.',
          'Die Invektiven gegen Catilina sind vernichtend. Cicero greift nicht nur sein Handeln an, sondern auch seinen Charakter, seine Beziehungen und seine Ziele.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Politische Strategie',
        content: [
          'Schnelle Reaktion: Durch schnelle Handlung und dramatische Konfrontation verhindert Cicero einen Bürgerkrieg im Keim.',
          'Öffentlich machen: Cicero macht die Verschwörung öffentlich bekannt, um die Bevölkerung zu mobilisieren.',
          'Moralische Überlegenheit: Er stellt sich als Retter der Republik dar – eine Rolle, die ihm später zum Verhängnis wird.',
          'Präventivschlag: Cicero setzt auf harte Maßnahmen (Todesurteile ohne regulären Prozess), um zukünftige Aufstände zu verhindern.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Die berühmte Anrede',
        description: 'Die Eröffnung »Quo usque tandem abutere, Catilina, patientia nostra?« ist eine der wirkungsvollsten Zeilen der lateinischen Literatur – vier Worte, die sofort festlegen, was folgt: Anklage, Verachtung, Autorität.',
        examples: [
          'Alliteration: »Quo usque tandem«',
          'Rhetorische Frage mit impliziter Antwort',
          'Die praetorische Autorität des Konsuls wird sofort etabliert'
        ]
      },
      {
        title: 'Wiederholung als Stilmittel',
        description: 'Cicero nutzt Anapher und Epistrophe (Wiederholung am Anfang/Ende von Sätzen) für rhythmische und emotionale Kraft.',
        examples: [
          'Wiederholte »O patria, patria!« für dramatische Innigkeit',
          'Aufzählungen von Catilinas Verbrechen in parallelischer Struktur'
        ]
      },
      {
        title: 'Psychologische Analyse',
        description: 'Cicero zeigt tiefes psychologisches Verständnis. Er analysiert Catilinas Motivationen (Schulden, Ehrgeiz), seine Persönlichkeit (rücksichtslos, gewalttätig) und seinen Hilfsbedarf.',
        examples: [
          'Beschreibung von Catilinas verschwendungsüchtiger Vergangenheit',
          'Analyse der Folgen von Schuldknechtschaft auf die Psyche',
          'Porträt eines unzufriedenen Aristokraten'
        ]
      },
      {
        title: 'Authentische Atmosphäre',
        description: 'Cicero schafft Spannung durch Details – den Senat im Aufruhr, Angst in den Straßen Roms, die Gefahr der Nacht. Der Leser spürt die Dramatik.',
        examples: [
          'Beschreibung von Verschwörertreffen in Catilinas Haus',
          'Schilderung der Angst in Rom',
          'Details über Catilinas Pläne und Bewegungen'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Enthüllung der Verschwörung',
        date: 'Herbst 63 v. Chr.',
        description: 'Cicero erfährt durch Spione von Catilinas Plänen. Er sammelt Beweise und bereitet seine Attacke vor.',
        significance: 'Der kritische Moment, in dem Cicero zwischen Kluft und Handlung wählt. Er handelt schnell und entschlossen.'
      },
      {
        title: 'Konfrontation im Senat',
        date: '8. November 63 v. Chr.',
        description: 'Cicero hält die erste Rede gegen Catilina – direkt vor ihm, im Senat. Ein dramatischer Moment mit »Quo usque tandem...«',
        significance: 'Catilina wird öffentlich beschuldigt. Er verlässt Rom noch am selben Tag – eine Niederlage, aber auch eine Eingeständnis von Schuld.'
      },
      {
        title: 'Todesurteile der Verschwörer',
        date: 'Dezember 63 v. Chr.',
        description: 'Die in Rom gefangenen Verschwörer werden ohne regulären Prozess hingerichtet – ein verfassungsrechtlich fragwürdiger Akt.',
        significance: 'Cicero etabliert sich als Diktator des Augenblicks. Diese Maßnahme wird später zu seiner Verurteilung und Verbannung führen.'
      },
      {
        title: 'Catilinas Tod',
        date: '62 v. Chr.',
        description: 'Catilina fällt mit seinen verbleibenden Anhängern in der Schlacht von Pistoia in Etrurien.',
        significance: 'Das dramatische Ende – aber auch das Ende von Ciceros Glück. Er hatte sich als Retter der Republik positioniert, wurde aber später selbst zum Opfer politischer Feindschaft.'
      }
    ],
    quotes: [
      {
        latin: 'Quo usque tandem abutere, Catilina, patientia nostra?',
        translation: 'Wie lange noch, Catilina, wirst du unsere Geduld missbrauchen?',
        context: 'Die berühmteste Zeile – der Satzanfang einer Freske der lateinischen Rhetorik. Mit diesen vier Worten etabliert Cicero Autorität und Verachtung.'
      },
      {
        latin: 'O patria, patria, locus iste quem sacpe meminisse me delectat!',
        translation: 'O Vaterland, Vaterland, dieser Ort, an den mich zu erinnern, mich erfreut!',
        context: 'Ciceros leidenschaftliche Verteidigungsrede für Rom. Eine emotionale Appell an das Patriotismus der Senatoren.'
      },
      {
        latin: 'Silent enim leges inter arma.',
        translation: 'Denn unter den Waffen schweigen die Gesetze.',
        context: 'Ciceros Rechtfertigung für außerordentliche Maßnahmen – ein problematischer, aber politisch wirksamer Satz, der später gegen ihn verwendet wird.'
      }
    ],
    impact: {
      title: 'Wirkung & Vermächtnis',
      paragraphs: [
        'Die Catilinarischen Reden machten Cicero zum berühmtesten Redner seiner Zeit. Sie zeigen die Kraft der Rhetorik – eine Verschwörung wurde nicht durch Gewalt, sondern durch Worte besiegt.',
        'Allerdings legten die Maßnahmen auch den Grundstein für Ciceros späteren Fall. Seine Gegner (besonders Caesar, Pompeius und Crassus) nutzten Ciceros außerordentliche Vollmachten als Vorwand, um später ihre eigene Machtkonzentration zu rechtfertigen.',
        'Die Reden sind heute ein Klassiker der Rhetorik. Sie zeigen alle Techniken: Invektive, Appell, Logik, Emotion. Sie sind auch ein Lehrbuch über die Grenzen zwischen notwendiger Sicherheit und despotischer Überschreitung.'
      ],
      highlights: [
        'Verhindert einen Bürgerkrieg im Keim',
        'Cicero wird zum »pater patriae« (Vater des Vaterlandes)',
        'Zeigt die Macht der Rhetorik – Verschwörung durch Worte besiegt',
        'Das Problem: Zukünftige Machthaber rechtfertigen ihre Übergriffe mit Ciceros Präzedenzfall',
        'Ein pyrrhussieg – Cicero siegt, wird aber später für seine Maßnahmen unschuldiger Menschen verurteilt und verbannt'
      ]
    }
  },
  'de-officiis': {
    slug: 'de-officiis',
    context: {
      title: 'Zeitlicher Kontext',
      paragraphs: [
        'De Officiis wurde in den letzten Monaten von Ciceros Leben geschrieben (Oktober-November 44 v. Chr.), nur wenige Wochen nach Caesars Ermordung am 15. März 44 v. Chr.',
        'Cicero schrieb das Werk als Brief an seinen Sohn Marcus, der damals in Athen studierte. Es ist eine Art Testament – Ciceros Vermächtniswerk über Ethik und Pflicht in einer Zeit des Chaos.',
        'Politisch ist der Moment turbulent: Die Caesarmörder haben die Macht übernommen, aber die Stabilität ist fragil. Marcus Antonius, der Konsul, verkörpert die neue Hoffnung – oder die neue Bedrohung. Cicero versucht, mit De Officiis eine moralische Orientierung zu geben.'
      ],
      timeline: [
        { year: '15. März 44 v. Chr.', event: 'Caesars Ermordung' },
        { year: 'März-April 44 v. Chr.', event: 'Übergangsphase, Hoffnung auf Restauration der Republik' },
        { year: 'Oktober-November 44 v. Chr.', event: 'Cicero schreibt De Officiis' },
        { year: '43 v. Chr.', event: 'Zweites Triumvirat, Cicero wird verfolgt und ermordet' },
        { year: 'Nachantike', event: 'De Officiis wird zum meistgelesenen antiken Werk neben der Bibel' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Philosophische Grundlagen',
        content: [
          'De Officiis kombiniert stoische Philosophie (Panaitios, Posidonios) mit römischer Praxis. Cicero übernimmt stoische Konzepte, macht sie aber "praktisch" für das römische Leben.',
          'Das Werk teilt sich in drei Bücher: I. Sittlichkeit (honestum), II. Nützlichkeit (utile), III. Die Auflösung von Konflikten zwischen beiden.',
          'Zentral ist die Idee, dass Tugendhaftigkeit und Nützlichkeit nicht im Widerspruch stehen – eine optimistische Sicht auf die moralische Ordnung des Universums.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Praktische Ethik',
        content: [
          'Vier Kardinaltugenden: Weisheit, Gerechtigkeit, Tapferkeit, Mäßigung – nicht abstrakt, sondern mit römischen Beispielen illustriert.',
          'Pflichten in verschiedenen Lebenssituationen: als Privatmann, als Senator, als Feldherr, als Freund.',
          'Die »gemischte Verfassung« als ideale Staatsform – ein Thema, das Cicero aus De Re Publica übernimmt und weiterentwickelt.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Form eines philosophischen Briefs',
        description: 'De Officiis ist kein systematisches Lehrbuch, sondern ein persönlicher Brief an Ciceros Sohn. Das macht es persönlich, zugänglich und zeitlos.',
        examples: [
          'Ton zwischen Vater und Sohn – liebevoll, aber auch ermahnend',
          'Mischung aus theoretischer Philosophie und praktischer Anwendung',
          'Viele Anekdoten und historische Beispiele aus Rom'
        ]
      },
      {
        title: 'Stoische Anpassung',
        description: 'Cicero übernimmt stoische Konzepte, passt sie aber an römische Werte und römische Tradition an. Er "latinisiert" die griechische Philosophie.',
        examples: [
          'Stoische Tugendlehre mit römischen Exempla',
          'Betonung von pietas (Pflicht zum Staat), fides (Treue), honor (Ehre) – speziell römische Konzepte',
          'Anwendung stoischer Prinzipien auf konkrete Lebenssituationen'
        ]
      },
      {
        title: 'Optimistische Weltanschauung',
        description: 'Im Gegensatz zu pessimistischen Skeptizisten argumentiert Cicero, dass das Universum moralisch geordnet ist und dass Tugend mit Nützlichkeit konvergiert.',
        examples: [
          'Die Idee einer »natura« (Natur), die das Ethische bestimmt',
          'Glaube an die Möglichkeit einer ethischen Ordnung',
          'Betonung der »recta ratio« (rechte Vernunft)'
        ]
      },
      {
        title: 'Behandlung von Dilemmas',
        description: 'Cicero behandelt schwierige ethische Fragen: Soll man einem Freund helfen, wenn er Unrecht begeht? Wann ist Täuschung gerechtfertigt?',
        examples: [
          'Das klassische Beispiel: Ein Sklavenverkäufer muss ich die Käufern über einen defekt berichten?',
          'Fragen zur Gerechtigkeit im Krieg',
          'Die Balance zwischen Nützlichkeit und Ethik'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Caesars Ermordung als Hintergrund',
        date: '15. März 44 v. Chr.',
        description: 'Die Ides of March – Caesar wird im Senat ermordet. Der Hoffnungsschimmer auf eine Restauration der Republik ist da.',
        significance: 'Oder ist es? De Officiis ist geschrieben vor Ciceros großer Enttäuschung (die Triumviren). Er versucht noch, eine ethische Grundlage für das politische Leben zu etablieren.'
      },
      {
        title: 'Ciceros Aufenthalt bei Atticus',
        date: 'Oktober-November 44 v. Chr.',
        description: 'Cicero zieht sich vorübergehend aus der Politik zurück und verbringt Zeit bei seinem Freund Atticus. In dieser Zeit schreibt er De Officiis.',
        significance: 'Eine Zeit der Reflexion. Cicero versucht, seinen Sohn zu unterweisen, bevor die Zeiten wieder turbulent werden – und das werden sie.'
      },
      {
        title: 'Die Triumvirn-Listen',
        date: 'November 43 v. Chr.',
        description: 'Weniger als ein Jahr nach De Officiis bilden Caesar Octavian, Marcus Antonius und Lepidus das Zweite Triumvirat. Cicero ist auf der Proskriptionsliste.',
        significance: 'Eine Refutation von allem, was Cicero in De Officiis predigte. Die Ethik scheitert vor der rohen Macht.'
      }
    ],
    quotes: [
      {
        latin: 'Honestum est quod iustum est, quod rectum est, quod denique ratione quadrat et cum natura congruens.',
        translation: 'Das Sitliche ist das Gerechte, das Anständige, das, was mit der Vernunft übereinstimmt und mit der Natur in Einklang steht.',
        context: 'Ciceros Definition des höchsten Guten – nicht Vergnügen oder Gewinn, sondern moralische Integrität im Einklang mit der Natur.'
      },
      {
        latin: 'Iustitia autem vacua est morte, iniuria vero et mala mens.',
        translation: 'Gerechtigkeit aber ist vakant ohne den Tod, Unrecht aber und Bösis...keit.',
        context: 'Eine schwierige Passage, die Ciceros Engagement für Gerechtigkeit trotz ihrer möglichen Konsequenzen zeigt.'
      },
      {
        latin: 'Non est igitur utile sed turpe illud lucrum quod est ex iniuria consectus.',
        translation: 'Jener Gewinn also, der aus Ungerechtigkeit nachgefolgt wird, ist nicht nützlich, sondern beschämend.',
        context: 'Ein Kernpunkt: Unethische Gewinne sind nicht nur falsch, sondern auch längerfristig nicht nützlich.'
      }
    ],
    impact: {
      title: 'Wirkung & Philosophisches Erbe',
      paragraphs: [
        'De Officiis wurde zum einflussreichsten antiken Ethik-Text außerhalb der Bibel. Im Mittelalter war es Pflichtlektüre, die Renaissance studierte es intensiv, die Aufklärung baute auf ihm auf.',
        'Der Text bietet keine einfachen Antworten, sondern trainiert den Leser im ethischen Denken. Das macht ihn zeitlos – jede Generation findet in De Officiis neue Anwendungen.',
        'Cicero gelingt es, griechische Philosophie mit römischen Werten zu verbinden. De Officiis ist daher nicht nur philosophisch wertvoll, sondern auch kulturhistorisch ein Fenster in die römische Mentalität.'
      ],
      highlights: [
        'Das meistgelesene philosophische Werk der abendländischen Welt (außer wissenschaftlichen Texten)',
        'Beeinflusst christliche Ethik durch mittelalterliche Übernahme',
        'Grundlage für die aufklärerische Naturrechst-Philosophie',
        'Zeigt Ciceros letzte Gedanken: Ein Mann an der Schwelle des Todes, der noch versucht, der Welt einen ethischen Rahmen zu geben',
        'Ein Meisterwerk der Vermittlung: Schwierige Philosophie wird praktisch und verständlich gemacht'
      ]
    }
  },
  'de-re-publica': {
    slug: 'de-re-publica',
    context: {
      title: 'Historischer und Persönlicher Kontext',
      paragraphs: [
        'De Re Publica wurde in den Jahren 54-51 v. Chr. verfasst, als Cicero zeitweilig aus der aktiven Politik ausgeschlossen war. Er hatte sich zurückgezogen und nutzte die Zeit für philosophische Werke.',
        'Das Werk ist in Form eines Dialogs aufgebaut und spielt im Garten des Scipio Aemilianus aus einer früheren Generation. Cicero nutzt die Vergangenheit, um seine Gegenwart zu kommentieren.',
        'Tragischerweise wurde De Re Publica später fast vollständig zerstört. Nur Fragmente blieben erhalten, rekonstruiert aus Zitaten späterer Autoren und einem mittelalterlichen Palimpsest, das 1819 wiederentdeckt wurde.'
      ],
      timeline: [
        { year: '54-51 v. Chr.', event: 'Abfassung von De Re Publica' },
        { year: 'Antike bis Mittelalter', event: 'Das Werk wird großenteils zerstört – nur Fragmente bleiben' },
        { year: '1819', event: 'Kardinal Mai entdeckt einen Palimpsest mit Teilen von De Re Publica' },
        { year: 'Renaissance bis heute', event: 'De Re Publica wird als Klassiker der Politikphilosophie rekonstruiert und studiert' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Literarische Bedeutung',
        content: [
          'De Re Publica ist Ciceros Meisterwerk der politischen Philosophie. Obwohl größtenteils verloren, zeigen die Fragmente einen Dialog von höchster literarischer Qualität.',
          'Der Dialogform gibt Cicero die Möglichkeit, verschiedene Perspektiven zu präsentieren. Scipio Aemilianus, Laelius, Philus und andere historische Figuren diskutieren über die beste Staatsform.',
          'Das Werk verbindet griechische Philosophie (Platon, Aristoteles) mit römischer Praxis. Cicero adaptiert die Ideen, macht sie aber für römische Leser verständlich und relevant.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Strategische Ziele',
        content: [
          'Theoretische Grundlegung: Cicero wollte eine umfassende Theorie des idealen Staates entwickeln, die auf römischen Werten basiert.',
          'Politische Intervention: Durch die historische Distanz konnte er Kritik an der aktuellen politischen Situation üben, ohne direkt anzugreifen.',
          'Bildungsziel: Das Werk sollte römische Eliten über politische Theorie und ethische Führung aufklären.',
          'Vermächtnis: Cicero wollte ein bleibendes Werk schaffen, das seine politischen Überzeugungen für die Nachwelt festhält.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Dialogform als Mittel',
        description: 'Cicero nutzt den philosophischen Dialog, um komplexe Ideen zugänglich zu machen. Die Gesprächsform erlaubt es, verschiedene Standpunkte zu präsentieren und schrittweise zu einer Lösung zu kommen.',
        examples: [
          'Historische Figuren als Gesprächspartner erhöhen Authentizität',
          'Sokratische Methode: Fragen und Antworten führen zur Erkenntnis',
          'Dramatische Elemente machen die Theorie lebendig'
        ]
      },
      {
        title: 'Römische Adaptation',
        description: 'Cicero übernimmt griechische Konzepte, aber "romanisiert" sie. Er zeigt, dass die römische Verfassung bereits die ideale Form verwirklicht.',
        examples: [
          'Die gemischte Verfassung als römische Erfindung',
          'Stoische Ethik wird zu römischer Tugendlehre',
          'Platons Ideen werden mit römischer Geschichte verbunden'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Definition des Staates',
        date: 'Buch I',
        description: 'Cicero definiert den Staat als "res populi" - Sache des Volkes. Diese Definition betont, dass ein Staat ohne Volkswillen keine wahre Gemeinschaft ist.',
        significance: 'Grundlegende Neudefinition des Staatsbegriffs, die über die Antike hinauswirkt und moderne Demokratietheorien beeinflusst.'
      },
      {
        title: 'Der Traum von Scipio',
        date: 'Buch VI',
        description: 'Ciceros berühmtester Abschnitt: Scipio Aemilianus träumt vom Kosmos und vom Platz des Menschen im Universum. Er sieht die Erde als winzigen Teil des Universums.',
        significance: 'Eines der einflussreichsten Texte der mittelalterlichen Philosophie. Verbindet politische Theorie mit Kosmologie und Ethik.'
      },
      {
        title: 'Kritik an Tyrannen',
        date: 'Buch II-III',
        description: 'Durch die Figur des Philus lässt Cicero Argumente für Tyrannis vortragen, nur um sie dann zu widerlegen. Dies zeigt seine rhetorische Meisterschaft.',
        significance: 'Systematische Widerlegung von Tyrannei-Theorien. Bietet intellektuelle Waffen gegen politische Extreme.'
      }
    ],
    quotes: [
      {
        latin: 'Res publica est res populi.',
        translation: 'Der Staat ist die Sache des Volkes.',
        context: 'Ciceros berühmte Definition des Staates in Buch I. Diese einfache Formel fasst seine gesamte politische Philosophie zusammen.'
      },
      {
        latin: 'Salus populi suprema lex esto.',
        translation: 'Das Wohl des Volkes sei das oberste Gesetz.',
        context: 'Grundsatz aus dem Traum von Scipio. Formuliert den Kern legitimer politischer Herrschaft.'
      }
    ],
    impact: {
      title: 'Historische Wirkung',
      paragraphs: [
        'De Re Publica wurde zum Fundament der westlichen politischen Theorie. Obwohl größtenteils verloren, beeinflussten die Fragmente Augustinus, Thomas von Aquin und die Renaissance.',
        'Die Definition des Staates als "res populi" wurde zur Grundlage moderner Demokratietheorien. Die Idee der gemischten Verfassung beeinflusste die amerikanische und französische Verfassung.',
        'Der "Traum von Scipio" wurde im Mittelalter als eigenständiges Werk gelesen und beeinflusste die kosmologischen Vorstellungen des Christentums.',
        'Ciceros Verbindung von Ethik und Politik prägte das abendländische Denken über gute Herrschaft und Staatsräson bis in die Neuzeit.'
      ],
      highlights: [
        'Grundlage der westlichen politischen Philosophie',
        'Beeinflussung von Verfassungsdenken in Europa und Amerika',
        'Vermittlung antiker politischer Ideen an das Mittelalter',
        'Verbindung von Ethik und Politik als Leitprinzip'
      ]
    }
  },
  'de-ira': {
    slug: 'de-ira',
    context: {
      title: 'Historischer Kontext',
      paragraphs: [
        'De Ira wurde um 55 n. Chr. von Seneca dem Jüngeren verfasst, während er als Berater des jungen Nero tätig war. Das Werk entstand in einer Zeit politischer Spannungen und persönlicher Herausforderungen.',
        'Die Abhandlung über den Zorn ist Teil von Senecas moralphilosophischen Schriften, die sich mit der Beherrschung der Affekte beschäftigen. Sie richtet sich an seinen Bruder Novatus und an alle, die nach einem tugendhaften Leben streben.',
        'Das Werk reflektiert stoische Philosophie in praktischer Form. Seneca will zeigen, dass Zorn nicht nur moralisch verwerflich, sondern auch schädlich für den Verstand und den Körper ist.'
      ],
      timeline: [
        { year: '54 n. Chr.', event: 'Seneca wird Berater Neros' },
        { year: '55 n. Chr.', event: 'Verfassung von De Ira' },
        { year: '59 n. Chr.', event: 'Agrippina wird ermordet - politische Instabilität' },
        { year: '62 n. Chr.', event: 'Seneca verliert politischen Einfluss' },
        { year: '65 n. Chr.', event: 'Seneca wird zum Selbstmord gezwungen' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Literarische Bedeutung',
        content: [
          'De Ira ist ein Meisterwerk der römischen Moralphilosophie. Seneca verbindet theoretische Reflexion mit praktischer Lebenshilfe in einer Weise, die für die Antike neuartig war.',
          'Das Werk zeigt Senecas meisterhafte Beherrschung der lateinischen Sprache. Die Sätze sind prägnant, die Argumente klar, die Beispiele lebendig.',
          'Die psychologische Tiefe der Analyse ist bemerkenswert. Seneca beschreibt nicht nur, was Zorn ist, sondern wie er entsteht, wie er sich im Körper äußert und wie man ihn bekämpfen kann.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Strategische Ziele',
        content: [
          'Praktische Ethik: Seneca will keine abstrakte Theorie, sondern konkrete Hilfestellung für das tägliche Leben.',
          'Politische Relevanz: In einer Zeit wachsender Tyrannei zeigt Seneca, wie man emotionale Stabilität bewahrt.',
          'Selbstdisziplin: Das Werk ist auch an Seneca selbst gerichtet - er muss seine eigenen Affekte kontrollieren, um als Berater zu überleben.',
          'Philosophische Vermittlung: Stoische Lehren sollen einem breiteren Publikum zugänglich gemacht werden.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Psychologische Analyse',
        description: 'Seneca analysiert den Zorn wie ein moderner Psychologe. Er untersucht Ursachen, Symptome und Behandlungsmethoden mit großer Präzision.',
        examples: [
          'Beschreibung körperlicher Symptome: Erröten, Zittern, Hitze',
          'Analyse von Auslösern: Beleidigungen, Ungerechtigkeit, Übermüdung',
          'Differenzierung zwischen berechtigtem und unberechtigtem Zorn'
        ]
      },
      {
        title: 'Praktische Ratschläge',
        description: 'Das Werk ist voll konkreter Empfehlungen. Seneca gibt nicht nur Theorie, sondern Handlungsanweisungen für kritische Momente.',
        examples: [
          'Zähle bis zehn bevor du reagierst',
          'Atme tief durch, bevor du sprichst',
          'Unterbrich die Kettenreaktion negativer Gedanken',
          'Vermeide Situationen, die dich wütend machen'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Definition des Zorns',
        date: 'Buch I',
        description: 'Seneca definiert Zorn als "kurzen Wahnsinn" - eine vorübergehende Geistesstörung, die den Verstand trübt.',
        significance: 'Grundlegende Definition, die das gesamte Werk prägt. Zorn ist keine natürliche Emotion, sondern eine Form der Unvernunft.'
      },
      {
        title: 'Die drei Ursachen',
        date: 'Buch II',
        description: 'Seneca identifiziert drei Hauptursachen: wahrgenommene Beleidigungen, Ungerechtigkeit, und der Eindruck, man könnte sich rächen.',
        significance: 'Systematische Analyse hilft, Zorn im Vorfeld zu erkennen und zu vermeiden.'
      },
      {
        title: 'Präventive Maßnahmen',
        date: 'Buch III',
        description: 'Seneca schlägt konkrete Techniken vor: Vermeidung von Zornauslösern, Vorbereitung auf Provokationen, philosophische Schulung.',
        significance: 'Der Übergang von Theorie zur Praxis. Seneca zeigt, wie man ein zornfreies Leben führen kann.'
      }
    ],
    quotes: [
      {
        latin: 'Ira brevis est, at in belua longa est.',
        translation: 'Der Zorn ist kurz, aber die Bestie ist lang.',
        context: 'Seneca warnt davor, dass auch kurze Wutanfälle langfristige Konsequenzen haben können.'
      },
      {
        latin: 'Quamuis enim adfectus non sunt in nostra potestate, voluntas tamen est.',
        translation: 'Obwohl die Affekte nicht in unserer Macht stehen, steht es doch in unserer Macht.',
        context: 'Seneca betont die menschliche Fähigkeit zur Selbstkontrolle trotz emotionaler Herausforderungen.'
      }
    ],
    impact: {
      title: 'Historische Wirkung',
      paragraphs: [
        'De Ira wurde zum einflussreichsten antiken Werk über Emotionsregulation. Es beeinflusste nicht nur die Philosophie, sondern auch die christliche Ethik und die moderne Psychologie.',
        'Das Werk zeigt die Relevanz stoischer Philosophie für das moderne Leben. Senecas Ratschläge zur Stressbewältigung und Wutkontrolle sind heute aktueller denn je.',
        'De Ira etablierte ein neues Genre: die praktische philosophische Selbsthilfe. Es beweist, dass antike Weisheit konkret und anwendbar sein kann.'
      ],
      highlights: [
        'Grundlage für moderne Emotionsregulationstheorien',
        'Einfluss auf christliche Tugendlehren',
        'Vorbild für psychologische Ratgeberliteratur',
        'Zeitlose Relevanz für Stressmanagement und Selbstkontrolle'
      ]
    }
  },
  'epistulae-morales': {
    slug: 'epistulae-morales',
    context: {
      title: 'Historischer Kontext',
      paragraphs: [
        'Die Epistulae Morales wurden von Seneca zwischen 62 und 65 n. Chr. verfasst, als er sich zunehmend aus der Politik zurückzog. Die Briefe sind an Lucilius Junior gerichtet, einen Freund und Schüler.',
        'Die Sammlung umfasst 124 Briefe, die sich mit philosophischen und ethischen Themen befassen. Sie entstanden in einer Zeit persönlicher Reflexion nach dem Verlust politischen Einflusses.',
        'Das Werk ist einzigartig in der antiken Literatur: philosophische Lehren in Briefform. Diese Form macht die Inhalte persönlicher, zugänglicher und direkt anwendbar.'
      ],
      timeline: [
        { year: '62 n. Chr.', event: 'Seneca verliert politischen Einfluss' },
        { year: '62-65 n. Chr.', event: 'Verfassung der Epistulae Morales' },
        { year: '65 n. Chr.', event: 'Seneca wird zum Selbstmord gezwungen' },
        { year: '1. Jh. n. Chr.', event: 'Briefe werden gesammelt und verbreitet' },
        { year: 'Mittelalter', event: 'Einfluss auf christliche Briefliteratur' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Literarische Bedeutung',
        content: [
          'Die Epistulae Morales sind ein Meisterwerk der antiken Briefform. Seneca verbindet persönliche Nähe mit philosophischer Tiefe in einzigartiger Weise.',
          'Das Werk etablierte ein neues Genre: den philosophischen Brief. Statt trockener Abhandlungen bietet Seneca lebendige, persönliche Unterweisungen.',
          'Die sprachliche Meisterschaft ist bemerkenswert. Seneca schreibt klar, elegant und überzeugend - beweist, dass Philosophie schön sein kann.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Strategische Ziele',
        content: [
          'Persönliche Unterweisung: Seneca will Lucilius nicht nur belehren, sondern ihn zu einem besseren Menschen formen.',
          'Philosophische Popularisierung: Komplexe stoische Lehren sollen einem breiteren Publikum zugänglich gemacht werden.',
          'Selbstreflexion: Die Briefe sind auch an Seneca selbst gerichtet - er festigt seine eigene philosophische Überzeugung.',
          'Ethik im Alltag: Philosophie soll nicht abstrakt sein, sondern konkret im Leben helfen.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Briefform als Mittel',
        description: 'Die Briefform macht Philosophie persönlich und direkt. Seneca spricht Lucilius wie einen Freund an, nicht wie einen Schüler.',
        examples: [
          'Persönliche Anreden: "Mein lieber Lucilius"',
          'Konkrete Lebenssituationen als Ausgangspunkt',
          'Dialogischer Charakter trotz Einseitigkeit'
        ]
      },
      {
        title: 'Praktische Weisheit',
        description: 'Seneca gibt keine abstrakten Theorien, sondern konkrete Ratschläge für tägliche Herausforderungen.',
        examples: [
          'Umgang mit Reichtum und Armut',
          'Bewältigung von Krankheit und Alter',
          'Strategien gegen Angst und Sorgen',
          'Kunst des richtigen Lebens'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Brief über die Freundschaft',
        date: 'Brief III',
        description: 'Seneca reflektiert über wahre Freundschaft und wie man sie pflegt. Freundschaft als höchstes Gut.',
        significance: 'Grundlegende Reflexion über menschliche Beziehungen. Freundschaft als philosophische Praxis und ethische Verpflichtung.'
      },
      {
        title: 'Brief über die Zeit',
        date: 'Brief I',
        description: 'Seneca rät Lucilius, die Zeit zu nutzen und nicht zu verschwenden. "Lebe eilig" als Leitprinzip.',
        significance: 'Einflussreicher Rat zur Lebensführung. Zeit als kostbarstes Gut, das bewusst eingesetzt werden muss.'
      },
      {
        title: 'Brief über den Tod',
        date: 'Brief IV',
        description: 'Seneca behandelt die Angst vor dem Tod und argumentiert, dass ein philosophisch vorbereiteter Mensch keine Furcht zu haben braucht.',
        significance: 'Zeigt stoische Haltung zur Endlichkeit. Der Tod als natürlicher Teil des Lebens, nicht als Schrecken.'
      }
    ],
    quotes: [
      {
        latin: 'Vivere, Lucili, non est necesse, sed bene vivere est necesse.',
        translation: 'Zu leben, Lucilius, ist nicht notwendig, aber gut zu leben ist notwendig.',
        context: 'Seneca betont die Qualität über die Quantität des Lebens. Ein kurzes, aber tugendhaftes Leben ist besser als ein langes, aber schlechtes.'
      },
      {
        latin: 'Non est ad aetatem mordendum, sed ad adulescentiam.',
        translation: 'Nicht an das Alter, sondern an die Jugend soll man sich gewöhnen.',
        context: 'Seneca rät, tugendhaft zu leben, unabhängig vom Alter. Moralische Entwicklung ist lebenslang.'
      }
    ],
    impact: {
      title: 'Historische Wirkung',
      paragraphs: [
        'Die Epistulae Morales wurden zum einflussreichsten philosophischen Werk der römischen Kaiserzeit. Sie prägten das abendländische Denken über Ethik und Lebensführung.',
        'Das Werk beeinflusste nicht nur die Philosophie, sondern auch die christliche Spiritualität. Die Briefform wurde zum Vorbild für spätere geistliche Literatur.',
        'Heute sind die Briefe aktueller denn je. Senecas Ratschläge zu Stress, Zeitmanagement und Lebensführung sprechen moderne Leser direkt an.'
      ],
      highlights: [
        'Grundlage der abendländischen Lebensphilosophie',
        'Einfluss auf christliche Briefliteratur',
        'Vorbild für moderne Selbsthilfeliteratur',
        'Zeitlose Relevanz für persönliche Entwicklung'
      ]
    }
  },
  'philippicae': {
    slug: 'philippicae',
    context: {
      title: 'Historischer Kontext',
      paragraphs: [
        'Die Philippicae sind eine Serie von 14 Reden, die Cicero zwischen 44 und 43 v. Chr. gegen Marcus Antonius hielt. Der Name bezieht sich auf Demosthenes\' Philippicae gegen Philipp II. von Makedonien.',
        'Nach Caesars Ermordung versuchte Antonius, Caesars Erbe anzutreten und die Macht zu übernehmen. Cicero sah in ihm eine Bedrohung für die Republik und wurde zu seinem entschiedensten Gegner.',
        'Die Reden sind Ciceros letztes politisches Bekenntnis. Sie zeigen seine Verzweiflung über die Zukunft der Republik und seinen Mut, sich dem mächtigsten Mann Roms zu stellen.'
      ],
      timeline: [
        { year: '15. März 44 v. Chr.', event: 'Caesars Ermordung' },
        { year: 'Sommer 44 v. Chr.', event: 'Beginn der Philippicae' },
        { year: 'September 44 v. Chr.', event: 'Erste Philippica im Senat' },
        { year: 'Januar 43 v. Chr.', event: 'Cicero flieht aus Rom' },
        { year: '7. Dezember 43 v. Chr.', event: 'Ciceros Hinrichtung auf Antonius\' Befehl' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Literarische Bedeutung',
        content: [
          'Die Philippicae sind Ciceros rhetorisches Meisterwerk. Sie zeigen seine Fähigkeit, komplexe politische Argumente in überzeugende Sprache zu fassen.',
          'Das Werk ist einzigartig als Beispiel politischer Rede in der Krise. Cicero verbindet persönliche Leidenschaft mit rationaler Argumentation.',
          'Die Reden zeigen die Entwicklung von Ciceros Stil: von der Hoffnung auf Rettung der Republik zur resignierten Erkenntnis ihres Untergangs.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Strategische Ziele',
        content: [
          'Politische Mobilisierung: Cicero will den Senat und das Volk gegen Antonius aufbringen.',
          'Moralische Delegitimierung: Antonius soll als Tyrann und Feind der Republik dargestellt werden.',
          'Historische Verantwortung: Cicero fühlt sich verpflichtet, für die Republik zu kämpfen, auch wenn es aussichtslos ist.',
          'Persönliches Vermächtnis: Die Reden sollen Ciceros Rolle als Verteidiger der Republik für die Nachwelt festhalten.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Emotionale Rhetorik',
        description: 'Cicero setzt alle rhetorischen Mittel ein, um seine Zuhörer zu bewegen. Die Reden sind voller Leidenschaft und moralischer Empörung.',
        examples: [
          'Direkte Anreden an Antonius als "Feind des Vaterlandes"',
          'Dramatische Schilderungen von Antonius\' Gräueltaten',
          'Appelle an die Tradition und die Vorfahren'
        ]
      },
      {
        title: 'Historische Argumentation',
        description: 'Cicero nutzt historische Beispiele, um seine Argumente zu untermauern. Er zeigt Parallelen zu früheren Krisen der Republik.',
        examples: [
          'Vergleiche mit Catilina und anderen Staatsfeinden',
          'Beispiele aus der römischen Geschichte für Tyrannenbekämpfung',
          ' Berufung auf die Gründerväter und ihre Ideale'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Erste Philippica',
        date: '2. September 44 v. Chr.',
        description: 'Cicero hält seine erste Rede gegen Antonius im Senat. Er kritisiert dessen Verhalten nach Caesars Tod.',
        significance: 'Der Beginn des offenen Konflikts. Cicero positioniert sich als führender Gegner Antonius\'.'
      },
      {
        title: 'Dritte Philippica',
        date: 'Dezember 44 v. Chr.',
        description: 'Cicero enthüllt Antonius\' Pläne, die Verfassung zu ändern und sich zum Diktator zu machen.',
        significance: 'Enthüllung der tyrannischen Ambitionen. Cicero zeigt, dass Antonius die Republik zerstören will.'
      },
      {
        title: 'Letzte Philippica',
        date: 'April 43 v. Chr.',
        description: 'Ciceros letzte Rede. Er erkennt die Aussichtslosigkeit, aber kämpft weiter für seine Überzeugungen.',
        significance: 'Das heroische Ende eines großen Republikaners. Cicero weiß um seinen Tod, bleibt aber standhaft.'
      }
    ],
    quotes: [
      {
        latin: 'O tempora! O mores!',
        translation: 'O Zeiten! O Sitten!',
        context: 'Ciceros berühmter Klageausdruck über den moralischen Verfall seiner Zeit. Aus der ersten Philippica.'
      },
      {
        latin: 'Non est enim mihi cum istis turpibus, quorum ista est aetas, non solum dissensio, sed etiam bellum.',
        translation: 'Denn mit diesen Schurken, deren Alter dieses ist, habe ich nicht nur Meinungsverschiedenheit, sondern sogar Krieg.',
        context: 'Ciceros radikale Positionierung gegen Antonius und seine Anhänger.'
      }
    ],
    impact: {
      title: 'Historische Wirkung',
      paragraphs: [
        'Die Philippicae wurden zum Symbol des Widerstands gegen Tyrannen. Sie beeinflussten spätere Redner und politische Denker.',
        'Obwohl Cicero scheiterte, wurden seine Reden zum Vorbild für zivilen Ungehorsam und politischen Mut.',
        'Das Werk zeigt die Macht der Sprache in politischen Krisen. Ciceros Reden sind ein Lehrstück für politische Rhetorik und moralisches Handeln.'
      ],
      highlights: [
        'Symbol des Widerstands gegen Tyrannen',
        'Vorbild für politische Redekunst',
        'Einfluss auf abendländische politische Tradition',
        'Zeugnis höchster ziviler Tapferkeit'
      ]
    }
  },
  'res-gestae': {
    slug: 'res-gestae',
    context: {
      title: 'Historischer Kontext',
      paragraphs: [
        'Die Res Gestae Divi Augusti sind Augustus\' autobiografische Inschrift, die vor seinem Tod 14 n. Chr. in Bronze gegossen und vor seinem Mausoleum in Rom aufgestellt wurde.',
        'Das Werk ist einzigartig als offizielle Selbstdarstellung eines römischen Kaisers. Augustus präsentiert seine Taten in bescheidener Form, aber mit klarem politischen Ziel.',
        'Die Inschrift sollte das Bild des Princeps für die Nachwelt festhalten: nicht als Tyrann, sondern als Wiederhersteller der Republik und erster Bürger Roms.'
      ],
      timeline: [
        { year: '31 v. Chr.', event: 'Sieg bei Actium - Ende der Bürgerkriege' },
        { year: '27 v. Chr.', event: 'Erhalt des Augustus-Titels' },
        { year: '14 n. Chr.', event: 'Augustus\' Tod und Aufstellung der Inschrift' },
        { year: 'Mittelalter', event: 'Inschrift wird kopiert und tradiert' },
        { year: '1555', event: 'Wiederentdeckung in Ankara' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Literarische Bedeutung',
        content: [
          'Die Res Gestae sind ein Meisterwerk politischer Propaganda. Augustus beherrscht die Kunst der Selbstdarstellung wie kein anderer römischer Kaiser.',
          'Das Werk ist einzigartig als autobiografische Inschrift. Es verbindet persönliche Geschichte mit politischer Rechtfertigung.',
          'Die sprachliche Präzision und formale Vollkommenheit machen die Inschrift zum Vorbild römischer Epigraphik.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Strategische Ziele',
        content: [
          'Politische Legitimation: Augustus will seine Herrschaft als rechtmäßig und notwendig darstellen.',
          'Historisches Vermächtnis: Seine Taten sollen für die Nachwelt in bestem Licht festgehalten werden.',
          'Institutionalisierung: Das Werk soll das Prinzipat als neue Regierungsform etablieren.',
          'Moralisches Beispiel: Augustus will sich als Vorbild für zukünftige Herrscher präsentieren.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Bescheidene Sprache',
        description: 'Augustus verwendet bewusst einfachen, sachlichen Stil. Er vermeidet prunkvolle Worte und imperialen Ton.',
        examples: [
          'Kurze, präzise Sätze ohne rhetorische Ausschmückung',
          'Verwendung der dritten Person für objektive Darstellung',
          'Wiederholung von "Ich habe" statt imperiale Ansprüche'
        ]
      },
      {
        title: 'Numerische Präzision',
        description: 'Augustus untermauert seine Taten mit exakten Zahlen und Daten. Dies schafft den Eindruck von Wahrheit und Genauigkeit.',
        examples: [
          'Angaben über besiegte Feinde und eroberte Völker',
          'Präzise Zahlen für Geldspenden und Bauprojekte',
          'Exakte Datierung aller politischen Akte'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Machtergreifung',
        date: 'Kapitel 1',
        description: 'Augustus beschreibt, wie er mit 19 Jahren Soldaten auf seine Seite zog und die Republik "befreite".',
        significance: 'Rechtfertigung seiner Machtübernahme. Dargestellt als Notwendigkeit zur Rettung des Staates.'
      },
      {
        title: 'Triumph und Frieden',
        date: 'Kapitel 12-13',
        description: 'Augustus zählt seine Triumphe und schließt drei Siegestore. Er betont die Wiederherstellung des Friedens.',
        significance: 'Darstellung als Friedensbringer. Der Triumph als Symbol militärischen Erfolgs und göttlicher Gunst.'
      },
      {
        title: 'Machtübergabe',
        date: 'Kapitel 34-35',
        description: 'Augustus beschreibt, wie er seine Macht an Senat und Volk "zurückgab" - aber nur formal.',
        significance: 'Meisterstück politischer Inszenierung. Scheinbare Wiederherstellung der Republik bei tatsächlicher Machterhaltung.'
      }
    ],
    quotes: [
      {
        latin: 'In senatu autem in potestate fui, princeps senatus fui.',
        translation: 'Im Senat aber hatte ich Macht, ich war Fürst des Senats.',
        context: 'Augustus\' präzise Beschreibung seiner Position - nicht König, aber führender Senator.'
      },
      {
        latin: 'Republica constituta a me restituta est.',
        translation: 'Die Republik, die von mir errichtet wurde, ist wiederhergestellt.',
        context: 'Augustus\' berühmter Anspruch, die Republik wiederhergestellt zu haben.'
      }
    ],
    impact: {
      title: 'Historische Wirkung',
      paragraphs: [
        'Die Res Gestae wurden zum Vorbild für kaiserliche Selbstdarstellung. Spätere Kaiser versuchten, Augustus\' Stil zu imitieren.',
        'Das Werk beeinflusste das Bild des Prinzipats in der Nachwelt. Augustus etablierte das Ideal des "ersten Bürgers".',
        'Die Inschrift ist eine unschätzbare historische Quelle. Sie bietet Einblicke in augusteische Propaganda und die Entstehung des Kaisertums.'
      ],
      highlights: [
        'Vorbild für kaiserliche Propaganda',
        'Grundlage für das Bild des "guten Kaisers"',
        'Einfluss auf spätere Herrscherdarstellungen',
        'Unverzichtbare Quelle für augusteische Zeitgeschichte'
      ]
    }
  },
  'catilinae-coniuratio': {
    slug: 'catilinae-coniuratio',
    context: {
      title: 'Historischer Kontext',
      paragraphs: [
        'Sallusts Catilinae Coniuratio wurde um 50-45 v. Chr. verfasst, Jahrzehnte nach der eigentlichen Verschwörung. Das Werk ist eine historische Monografie über Catilinas Komplott.',
        'Sallust war ein Zeitgenosse der Ereignisse, aber kein direkter Teilnehmer. Er nutzt seine Erfahrung als Politiker, um die Ursachen der Krise zu analysieren.',
        'Das Werk ist einzigartig in der römischen Historiografie: Sallust kombiniert politische Analyse mit moralischer Reflexion über den Verfall der Republik.'
      ],
      timeline: [
        { year: '67 v. Chr.', event: 'Sallusts Prätur - politische Karriere beginnt' },
        { year: '63 v. Chr.', event: 'Catilinarische Verschwörung' },
        { year: '50-45 v. Chr.', event: 'Verfassung der Catilinae Coniuratio' },
        { year: '40 v. Chr.', event: 'Sallusts Rückzug aus der Politik' },
        { year: 'Antike', event: 'Werk wird als historische Quelle geschätzt' }
      ]
    },
    sections: [
      {
        icon: 'Award',
        title: 'Literarische Bedeutung',
        content: [
          'Die Catilinae Coniuratio ist ein Meisterwerk der römischen Geschichtsschreibung. Sallust etablierte neue Standards für historische Analyse.',
          'Das Werk zeigt Sallusts meisterhafte Beherrschung der lateinischen Sprache. Der Stil ist prägnant, die Charakterzeichnung lebendig.',
          'Sallust verbindet politische Geschichte mit moralischer Philosophie. Er fragt nicht nur "was" geschah, sondern "warum" es geschah.'
        ],
        type: 'literary'
      },
      {
        icon: 'Target',
        title: 'Strategische Ziele',
        content: [
          'Historische Analyse: Sallust will die wahren Ursachen der Krise untersuchen, nicht nur die Ereignisse beschreiben.',
          'Moralische Kritik: Das Werk ist eine Anklage gegen den moralischen Verfall der römischen Elite.',
          'Politische Lehre: Sallust will aus der Geschichte Lehren für die Gegenwart ziehen.',
          'Persönliches Vermächtnis: Der Autor will sich als kritischer Historiker und moralischer Autorität etablieren.'
        ],
        type: 'analysis'
      }
    ],
    literaryFeatures: [
      {
        title: 'Psychologische Charakteristik',
        description: 'Sallust zeichnet seine Figuren mit psychologischer Tiefe. Catilina ist nicht nur Bösewicht, sondern komplexe Persönlichkeit.',
        examples: [
          'Catilina als "ambitiös, aber fähig"',
          'Cicero als "tüchtig, aber eitel"',
          'Die Senatoren als "korrupt und gierig"'
        ]
      },
      {
        title: 'Moralische Analyse',
        description: 'Sallust geht über reine Ereignisgeschichte hinaus. Er analysiert die moralischen Ursachen politischer Krisen.',
        examples: [
          'Kritik am Reichtum als Ursache des Verfalls',
          'Analyse von Ehrgeiz und Machtgier',
          'Untersuchung der politischen Korruption'
        ]
      }
    ],
    keyMoments: [
      {
        title: 'Catilinas Charakter',
        date: 'Kapitel 5-14',
        description: 'Sallust analysiert Catilinas Persönlichkeit: adlig, aber verschuldet; ehrgeizig, aber fähig.',
        significance: 'Nuancierte Darstellung des "Helden". Catilina ist nicht einfach böse, sondern Produkt seiner Zeit.'
      },
      {
        title: 'Die Verschwörung',
        date: 'Kapitel 15-30',
        description: 'Detaillierte Schilderung des Komplotts: Pläne, Versammlungen, Vorbereitungen.',
        significance: 'Meisterhafte historische Rekonstruktion. Sallust zeigt, wie eine Verschwörung funktioniert.'
      },
      {
        title: 'Ciceros Rolle',
        date: 'Kapitel 31-58',
        description: 'Sallust analysiert Ciceros Handeln: schnell, entschlossen, aber auch selbstgefällig.',
        significance: 'Kritische Würdigung des "Helden". Sallust zeigt auch Ciceros Schwächen.'
      }
    ],
    quotes: [
      {
        latin: 'Omnis homines, qui sese student praestare ceteris, humilitate opprimuntur.',
        translation: 'Alle Menschen, die sich über andere erheben wollen, werden durch Demut gedrückt.',
        context: 'Sallusts Reflexion über Ehrgeiz und dessen Gefahren.'
      },
      {
        latin: 'Nam id quod initio non est, finem saepe habet difficiliorem.',
        translation: 'Denn was am Anfang nicht ist, hat oft am Ende ein schwierigeres.',
        context: 'Sallusts Beobachtung über politische Entwicklungen und ihre Konsequenzen.'
      }
    ],
    impact: {
      title: 'Historische Wirkung',
      paragraphs: [
        'Die Catilinae Coniuratio wurde zum Vorbild für römische Geschichtsschreibung. Sallust beeinflusste Tacitus und spätere Historiker.',
        'Das Werk etablierte neue Standards für historische Kritik. Sallust zeigte, dass Geschichte mehr als Chronologie sein kann.',
        'Heute ist das Werk eine unschätzbare Quelle für die späte Republik. Sallusts Analyse bleibt aktuell und anregend.'
      ],
      highlights: [
        'Vorbild für römische Historiografie',
        'Einfluss auf Tacitus und spätere Geschichtsschreiber',
        'Grundlage für historisch-politische Analyse',
        'Zeitlose Relevanz für Krisenforschung'
      ]
    }
  }
};