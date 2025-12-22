import { BookOpen, Award, Lightbulb, Quote, MapPin, Swords, Users, Scroll, Target } from 'lucide-react';

export interface WorkDetail {
  slug: string;
  sections: WorkSection[];
  quotes: WorkQuote[];
  keyMoments?: KeyMoment[];
  impact: ImpactSection;
  literaryFeatures: LiteraryFeature[];
  context: ContextSection;
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
  }
};
