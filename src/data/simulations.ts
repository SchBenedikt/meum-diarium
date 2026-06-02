export interface SimulationStats {
    welfare: number; // Wohl des Volkes
    influence: number; // Privater Einfluss/Popularität
    power: number; // Politische/Militärische Macht
}
export interface SimulationChoice {
    id: string;
    text: string;
    effect: {
        welfare?: number;
        influence?: number;
        power?: number;
    };
    response: string; // Narrative result of this choice
    nextEventId: string | 'END';
}
export interface SimulationEvent {
    id: string;
    title: string;
    description: string;
    choices: SimulationChoice[];
}
export interface SimulationScenario {
    id: string;
    authorId: string;
    title: string;
    date: string; // e.g., "10. Januar 49 v. Chr."
    description: string;
    initialStats: SimulationStats;
    events: Record<string, SimulationEvent>;
    startEventId: string;
}
export const simulations: Record<string, SimulationScenario[]> = {
    caesar: [
        {
            id: 'rubicon',
            authorId: 'caesar',
            title: 'Der Würfel ist gefallen',
            date: '10. Januar 49 v. Chr.',
            description: 'Ich stehe am Fluss Rubikon. Der Senat hat mir befohlen, mein Heer aufzulösen. Eine Rückkehr nach Rom ohne Armee bedeutet meinen politischen Tod. Mit Armee bedeutet es Bürgerkrieg.',
            initialStats: {
                welfare: 50,
                influence: 70,
                power: 80
            },
            startEventId: 'start',
            events: {
                'start': {
                    id: 'start',
                    title: 'Am Ufer des Rubikon',
                    description: 'Die Legio XIII steht bereit. Meine Offiziere warten auf meinen Befehl. Ein Bote des Senats fordert erneut meine sofortige Rückkehr als Privatmann.',
                    choices: [
                        {
                            id: 'cross',
                            text: 'Ich befehle den Marsch auf Rom! "Alea iacta est!"',
                            effect: { welfare: -10, influence: +5, power: +20 },
                            response: 'Die Legionäre jubeln mir zu. Ich überschreite die Grenze. Rom erzittert vor meinem Namen. Der Bürgerkrieg hat begonnen.',
                            nextEventId: 'rome_reaction'
                        },
                        {
                            id: 'wait',
                            text: 'Ich warte ab und sende Verhandlungsangebote.',
                            effect: { welfare: +5, influence: -10, power: -5 },
                            response: 'Meine Soldaten werden unruhig. In Rom nutzt Pompeius die Zeit, um seine Verteidigung gegen mich zu stärken.',
                            nextEventId: 'mutiny_risk'
                        },
                        {
                            id: 'resign',
                            text: 'Ich lege das Kommando nieder und kehre allein zurück.',
                            effect: { welfare: +20, influence: -30, power: -50 },
                            response: 'Ich werde in Rom gefeiert, aber politisch kaltgestellt. Meine Feinde lachen über meine Naivität.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'rome_reaction': {
                    id: 'rome_reaction',
                    title: 'Panik in Rom',
                    description: 'Nachricht von meinem Vormarsch erreicht die Hauptstadt. Senatoren fliehen. Pompeius sammelt Truppen in Brundisium.',
                    choices: [
                        {
                            id: 'chase',
                            text: 'Ich verfolge Pompeius sofort, um ihn zu stellen.',
                            effect: { welfare: -5, influence: -5, power: +10 },
                            response: 'Ein rasanter Marsch. Ich lasse Rom links liegen, aber Pompeius entkommt knapp nach Griechenland.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'seize_rome',
                            text: 'Ich sichere zuerst Rom und den Staatsschatz.',
                            effect: { welfare: +10, influence: +10, power: +5 },
                            response: 'Ich ziehe in Rom ein. Das Volk ist erleichtert, dass ich keine Plünderung zulasse. Der Staatsschatz gehört nun mir.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'mutiny_risk': {
                    id: 'mutiny_risk',
                    title: 'Unruhe im Lager',
                    description: 'Mein Zögern wird als Schwäche ausgelegt. Labienus, mein treuster General, scheint zu zweifeln.',
                    choices: [
                        {
                            id: 'speech',
                            text: 'Ich halte eine flammende Rede an die Truppen.',
                            effect: { welfare: 0, influence: +20, power: +10 },
                            response: 'Meine Rhetorik ist unübertroffen. Die Loyalität ist wiederhergestellt.',
                            nextEventId: 'start' // Loop back for demo purposes or proceed
                        },
                        {
                            id: 'bribe',
                            text: 'Ich verspreche doppelten Sold.',
                            effect: { welfare: -5, influence: -5, power: 0 },
                            response: 'Die Gier ist befriedigt, aber der Respekt vor mir leidet.',
                            nextEventId: 'start'
                        }
                    ]
                }
            }
        },
        {
            id: 'ides_march',
            authorId: 'caesar',
            title: 'Die Iden des März',
            date: '15. März 44 v. Chr.',
            description: 'Warnungen erreichen mich von allen Seiten. Calpurnia hatte schlimme Träume. Der Senat tagt heute im Theater des Pompeius.',
            initialStats: {
                welfare: 80,
                influence: 90,
                power: 100
            },
            startEventId: 'morning',
            events: {
                'morning': {
                    id: 'morning',
                    title: 'Der Morgen',
                    description: 'Decimus Brutus drängt mich zum Aufbruch. "Die Senatoren warten nur auf dich, um dich zum König zu machen."',
                    choices: [
                        {
                            id: 'go',
                            text: 'Ich gehe zum Senat. Angst darf nicht gezeigt werden.',
                            effect: { welfare: 0, influence: +5, power: 0 },
                            response: 'Ich betrete die Sänfte. Die Menge jubelt mir zu.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'stay',
                            text: 'Ich höre auf Calpurnias Warnung und bleibe zuhause.',
                            effect: { welfare: +10, influence: -15, power: -5 },
                            response: 'Ein kluger Mann hört auf die Zeichen. Die Verschwörer sind enttäuscht, aber ich lebe.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'gallic_war_start',
            authorId: 'caesar',
            title: 'Der Gallische Krieg beginnt',
            date: '58 v. Chr.',
            description: 'Die Helvetier haben beschlossen, durch meine Provinz zu ziehen. 368.000 Menschen sind in Bewegung. Was soll ich tun?',
            initialStats: {
                welfare: 60,
                influence: 50,
                power: 40
            },
            startEventId: 'helvetii_request',
            events: {
                'helvetii_request': {
                    id: 'helvetii_request',
                    title: 'Die Helvetier kommen',
                    description: 'Eine Gesandtschaft der Helvetier bittet um Durchzug durch die Provincia. Sie versprechen, friedlich zu sein.',
                    choices: [
                        {
                            id: 'deny',
                            text: 'Ich verweigere den Durchzug und bereite den Krieg vor.',
                            effect: { welfare: -5, influence: +10, power: +15 },
                            response: 'Meine Legionen werden eilig zusammengezogen. Die Helvetier sind gezwungen, einen anderen Weg zu suchen.',
                            nextEventId: 'battle_prep'
                        },
                        {
                            id: 'allow',
                            text: 'Ich erlaube den Durchzug unter Bedingungen.',
                            effect: { welfare: +10, influence: -5, power: -10 },
                            response: 'Die Helvetier ziehen friedlich durch. Rom fragt sich, ob ich zu weich bin.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'battle_prep': {
                    id: 'battle_prep',
                    title: 'Kriegsvorbereitungen',
                    description: 'Die Helvetier ziehen durch das Land der Haeduer, unserer Verbündeten. Sie plündern und verwüsten.',
                    choices: [
                        {
                            id: 'attack_now',
                            text: 'Sofortiger Angriff, während sie den Fluss überqueren!',
                            effect: { welfare: -10, influence: +20, power: +25 },
                            response: 'Ein brillanter Sieg! Die Helvetier sind geschlagen und müssen in ihre Heimat zurückkehren.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'wait',
                            text: 'Ich warte auf Verstärkungen.',
                            effect: { welfare: +5, influence: -5, power: +5 },
                            response: 'Meine Armee wächst, aber die Helvetier haben Zeit gewonnen.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'cleopatra_meeting',
            authorId: 'caesar',
            title: 'Begegnung mit Kleopatra',
            date: '48 v. Chr.',
            description: 'Alexandria. Nach meiner Verfolgung des Pompeius bin ich in Ägypten angekommen. Man flüstert von einer verbannten Königin...',
            initialStats: {
                welfare: 70,
                influence: 85,
                power: 75
            },
            startEventId: 'carpet',
            events: {
                'carpet': {
                    id: 'carpet',
                    title: 'Ein unerwartetes Geschenk',
                    description: 'Ein Teppich wird in meine Gemächer gebracht. Als er ausgerollt wird, fällt eine junge Frau heraus – Kleopatra, die verbannte Königin.',
                    choices: [
                        {
                            id: 'support',
                            text: 'Ich unterstütze ihren Anspruch auf den Thron.',
                            effect: { welfare: -5, influence: +15, power: +10 },
                            response: 'Eine Allianz wird geschmiedet. Ägyptens Reichtümer winken, aber Ptolemaios ist wütend.',
                            nextEventId: 'war_egypt'
                        },
                        {
                            id: 'neutral',
                            text: 'Ich bleibe neutral im ägyptischen Thronstreit.',
                            effect: { welfare: +5, influence: -10, power: 0 },
                            response: 'Kleopatra ist enttäuscht. Ich bleibe unparteiisch, aber verpasse eine Chance.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'war_egypt': {
                    id: 'war_egypt',
                    title: 'Der Alexandrinische Krieg',
                    description: 'Ptolemaios Armee umzingelt mein Quartier. Die Bibliothek von Alexandria brennt. Wir sind in der Unterzahl.',
                    choices: [
                        {
                            id: 'fight',
                            text: 'Ich führe meine Männer persönlich in die Schlacht!',
                            effect: { welfare: -15, influence: +25, power: +20 },
                            response: 'Ein waghalsiger Sieg! Ptolemaios ertrinkt im Nil. Kleopatra ist Königin – und mehr.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'negotiate',
                            text: 'Ich versuche zu verhandeln.',
                            effect: { welfare: +10, influence: -5, power: -5 },
                            response: 'Die Verhandlungen ziehen sich hin. Verstärkungen aus Judäa retten uns schließlich.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'triumvirate',
            authorId: 'caesar',
            title: 'Das Erste Triumvirat',
            date: '60 v. Chr.',
            description: 'Pompeius und Crassus – beide mächtig, beide verbittert mit dem Senat. Ich könnte sie vereinen... oder gegeneinander ausspielen.',
            initialStats: {
                welfare: 55,
                influence: 45,
                power: 35
            },
            startEventId: 'meeting',
            events: {
                'meeting': {
                    id: 'meeting',
                    title: 'Geheimes Treffen in Lucca',
                    description: 'Pompeius hat militärischen Ruhm, Crassus unermesslichen Reichtum, ich habe den Verstand. Zusammen könnten wir Rom beherrschen.',
                    choices: [
                        {
                            id: 'alliance',
                            text: 'Ich schlage ein Dreierbündnis vor – das Triumvirat.',
                            effect: { welfare: +5, influence: +20, power: +25 },
                            response: 'Die drei mächtigsten Männer Roms sind nun verbündet. Der Senat zittert vor unserer vereinten Macht.',
                            nextEventId: 'consolidate'
                        },
                        {
                            id: 'solo',
                            text: 'Ich versuche, sie gegeneinander auszuspielen.',
                            effect: { welfare: -10, influence: +5, power: +10 },
                            response: 'Ein riskantes Spiel. Pompeius durchschaut mich fast, aber noch halte ich die Fäden in der Hand.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'consolidate': {
                    id: 'consolidate',
                    title: 'Machtkonsolidierung',
                    description: 'Das Triumvirat herrscht. Wie soll ich meine Position festigen?',
                    choices: [
                        {
                            id: 'gallia',
                            text: 'Ich fordere das Kommando über Gallien – Krieg bringt Ruhm!',
                            effect: { welfare: -5, influence: +15, power: +30 },
                            response: 'Gallien wird mir zugesprochen. Die Legionen warten. Eine neue Ära beginnt.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'rome',
                            text: 'Ich bleibe in Rom und baue mein politisches Netzwerk aus.',
                            effect: { welfare: +15, influence: +25, power: +5 },
                            response: 'Mein Name ist in aller Munde. Das Volk liebt mich. Aber fehlt mir der militärische Ruhm?',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'britain',
            authorId: 'caesar',
            title: 'Die Invasion Britanniens',
            date: 'August 55 v. Chr.',
            description: 'Britannien liegt jenseits des Ozeans – geheimnisvoll, wild, unberührt von römischer Macht. Meine Kundschafter berichten von Klippen, Kriegern und einer unberechenbaren See. Der Rubikon war erst der Anfang.',
            initialStats: {
                welfare: 55,
                influence: 60,
                power: 70
            },
            startEventId: 'channel_crossing',
            events: {
                'channel_crossing': {
                    id: 'channel_crossing',
                    title: 'Die Überfahrt',
                    description: '80 Schiffe liegen bereit. Die Legionäre haben Angst vor dem Ozean – sie hören Geschichten von Seeungeheuern und dem Ende der Welt. Die Flut ist günstig.',
                    choices: [
                        {
                            id: 'embark',
                            text: 'Ich befehle die Überfahrt – der Ozean muss uns gehorchen!',
                            effect: { welfare: -5, influence: +15, power: +15 },
                            response: 'Die Überfahrt ist stürmisch, aber wir erreichen die weißen Klippen. Die Britannier starren ungläubig auf unsere Flotte.',
                            nextEventId: 'landing'
                        },
                        {
                            id: 'delay',
                            text: 'Ich warte auf besseres Wetter und mehr Kundschafter.',
                            effect: { welfare: +5, influence: -5, power: -10 },
                            response: 'Die Legionäre sind erleichtert, aber die Gallier lachen über meine Zögerlichkeit.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'landing': {
                    id: 'landing',
                    title: 'Die Landung',
                    description: 'Britannische Krieger stehen an den Klippen – bemalt, wild, mit Streitwagen. Der Strand ist eng, die Brandung gefährlich. Meine Legionäre zögern.',
                    choices: [
                        {
                            id: 'charge',
                            text: 'Ich lasse die Tribunen die Männer antreiben – Angriff um jeden Preis!',
                            effect: { welfare: -10, influence: +20, power: +25 },
                            response: 'Der Adler wird ans Ufer getragen. Meine Männer kämpfen wie Verrückte. Die Britannier fliehen ins Landesinnere.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'parley',
                            text: 'Ich verhandle mit den Britanniern – vielleicht werden sie Verbündete.',
                            effect: { welfare: +10, influence: +5, power: 0 },
                            response: 'Sie versprechen Frieden – aber ich traue ihnen nicht. In der Nacht greifen sie unsere Stellung an.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'crossing_rubicon_variant',
            authorId: 'caesar',
            title: 'Der Rubikon (andere Seite)',
            date: '10. Januar 49 v. Chr.',
            description: 'Was wäre gewesen, wenn ich Pompeius Angebot angenommen hätte? Ein letztes Friedensangebot liegt vor mir: Teile die Macht, kehre als Privatmann zurück, vermeide den Krieg.',
            initialStats: {
                welfare: 65,
                influence: 75,
                power: 85
            },
            startEventId: 'last_offer',
            events: {
                'last_offer': {
                    id: 'last_offer',
                    title: 'Das letzte Angebot',
                    description: 'Ein Bote des Pompeius erreicht mich am Rubikon. "Caesar, kehre um und verhandle. Der Senat ist bereit, dir Gallien zu lassen – wenn du das Kommando abgibst." Meine Offiziere sind gespalten.',
                    choices: [
                        {
                            id: 'negotiate',
                            text: 'Ich verhandle mit Pompeius – vielleicht ein friedliches Ende.',
                            effect: { welfare: +20, influence: +5, power: -10 },
                            response: 'Wochen des Verhandelns. Pompeius will Sicherheiten, ich will meine Ehre. Schließlich ein Kompromiss – aber die Republik ist für immer verändert.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'march',
                            text: 'Kein Verrat an meinen Legionen. Ich marschiere auf Rom!',
                            effect: { welfare: -10, influence: +10, power: +20 },
                            response: 'Die Würfel sind gefallen. Ich überschreite den Rubikon – der Bürgerkrieg beginnt. Pompeius flieht nach Griechenland.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        }
    ],
    cicero: [
        {
            id: 'catilinarian',
            authorId: 'cicero',
            title: 'Catilinarische Verschwörung',
            date: '8. November 63 v. Chr.',
            description: 'In der Nacht erhalte ich einen Brief: Catilina plant den Staatsstreich. Als Konsul muss ich jetzt handeln. Der Senat tagt im Jupitertempel.',
            initialStats: {
                welfare: 60,
                influence: 70,
                power: 50
            },
            startEventId: 'the_letter',
            events: {
                'the_letter': {
                    id: 'the_letter',
                    title: 'Der Brief',
                    description: 'Crassus übergibt mir anonyme Briefe, die Catilinas Pläne enthüllen. Morgen früh muss ich vor dem Senat sprechen. Catilina wird anwesend sein.',
                    choices: [
                        {
                            id: 'confront',
                            text: 'Ich halte die berühmte Rede "Quo usque tandem?" – direkte Konfrontation!',
                            effect: { welfare: +10, influence: +20, power: +15 },
                            response: 'Catilina verlässt den Senat. Meine Worte hallen durch die Jahrhunderte. "O tempora, o mores!"',
                            nextEventId: 'senate_reaction'
                        },
                        {
                            id: 'caution',
                            text: 'Ich sammle Beweise und handle erst später.',
                            effect: { welfare: +5, influence: -5, power: -10 },
                            response: 'Catilina bekommt Wind davon. Seine Anhänger bewaffnen sich in Eile.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'senate_reaction': {
                    id: 'senate_reaction',
                    title: 'Reaktion des Senats',
                    description: 'Catilina ist nach Etrurien geflohen. Der Senat verhängt den Ausnahmezustand. Seine Mitverschwörer sind noch in Rom.',
                    choices: [
                        {
                            id: 'execute',
                            text: 'Ich lasse die Verschwörer ohne Prozess hinrichten.',
                            effect: { welfare: +15, influence: +10, power: +5 },
                            response: '„Sie haben gelebt!" Die Verschwörer sterben im Tullianum. Rom ist gerettet – aber ich mache mir Feinde.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'imprison',
                            text: 'Ich lasse sie einsperren und ein ordentliches Verfahren abwarten.',
                            effect: { welfare: +5, influence: -5, power: -10 },
                            response: 'Die Verschwörer warten im Gefängnis. Catilina sammelt unterdessen ein Heer in Etrurien.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'exile',
            authorId: 'cicero',
            title: 'Im Exil',
            date: 'März 58 v. Chr.',
            description: 'Clodius, mein Todfeind, bringt ein Gesetz durch die Volksversammlung: Jeder, der römische Bürger ohne Prozess hinrichten ließ, soll verbannt werden. Er meint mich.',
            initialStats: {
                welfare: 40,
                influence: 30,
                power: 20
            },
            startEventId: 'leave_rome',
            events: {
                'leave_rome': {
                    id: 'leave_rome',
                    title: 'Flucht aus Rom',
                    description: 'Meine Freunde flehen mich an zu fliehen. Clodius bewaffnete Banden durchstreifen die Straßen. Mein Haus wird bereits belagert.',
                    choices: [
                        {
                            id: 'flee',
                            text: 'Ich verlasse Rom und gehe ins Exil nach Thessalonike.',
                            effect: { welfare: +5, influence: -10, power: -10 },
                            response: 'Ich verlasse Italien mit schwerem Herzen. Mein Haus wird niedergebrannt, mein Vermögen beschlagnahmt.',
                            nextEventId: 'return_strategy'
                        },
                        {
                            id: 'stay',
                            text: 'Ich bleibe und stelle mich dem Volk.',
                            effect: { welfare: -10, influence: -20, power: -5 },
                            response: 'Clodius Banditen greifen mich an. Fast verliere ich mein Leben. Pompeius schaut tatenlos zu.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'return_strategy': {
                    id: 'return_strategy',
                    title: 'Rückkehrplanung',
                    description: 'Im Exil erreicht mich die Nachricht: Pompeius und die Optimaten überlegen, meine Rückkehr zu unterstützen. Doch Clodius tobt. Es braucht einen Senatsbeschluss.',
                    choices: [
                        {
                            id: 'pompey',
                            text: 'Ich schreibe an Pompeius und bitte um seine Unterstützung.',
                            effect: { welfare: +5, influence: +15, power: +10 },
                            response: 'Pompeius willigt ein. Der Senat stimmt für meine Rückkehr. Nach 16 Monaten Exil kehre ich nach Rom zurück – triumphal!',
                            nextEventId: 'END'
                        },
                        {
                            id: 'wait',
                            text: 'Ich warte auf einen günstigeren Moment.',
                            effect: { welfare: -5, influence: -5, power: -5 },
                            response: 'Die Zeit vergeht. Clodius Macht schwindet langsam, aber ich verliere an Einfluss.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'philippics',
            authorId: 'cicero',
            title: 'Die Philippischen Reden',
            date: '2. September 44 v. Chr.',
            description: 'Caesar ist ermordet. Marcus Antonius hat die Macht an sich gerissen. Ich bin der einzige, der noch laut gegen ihn zu sprechen wagt.',
            initialStats: {
                welfare: 50,
                influence: 60,
                power: 30
            },
            startEventId: 'first_philippic',
            events: {
                'first_philippic': {
                    id: 'first_philippic',
                    title: 'Erste Philippische Rede',
                    description: 'Der Senat tagt. Antonius sitzt mir gegenüber. Wenn ich jetzt spreche, ist der Weg nicht mehr zurück.',
                    choices: [
                        {
                            id: 'attack',
                            text: 'Ich greife Antonius offen an: "Warum schweigst du, Antonius?"',
                            effect: { welfare: +10, influence: +20, power: +5 },
                            response: 'Meine Rede erschüttert den Senat. Antonius ist außer sich vor Wut. Octavian beobachtet mich aufmerksam.',
                            nextEventId: 'consequences'
                        },
                        {
                            id: 'silence',
                            text: 'Ich schweige vorerst und beobachte die Lage.',
                            effect: { welfare: 0, influence: -10, power: -5 },
                            response: 'Antonius triumphiert. Das Volk fragt sich, ob Cicero Angst hat.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'consequences': {
                    id: 'consequences',
                    title: 'Die Folgen',
                    description: 'Antonius ist erzürnt. Octavian sucht meine Unterstützung. Der Senat ist gespalten zwischen Antonius und den Caesarmördern.',
                    choices: [
                        {
                            id: 'ally_octavian',
                            text: 'Ich verbünde mich mit Octavian gegen Antonius.',
                            effect: { welfare: +5, influence: +15, power: +10 },
                            response: 'Eine unheilige Allianz. Octavian ist jung, aber klug. Gemeinsam zwingen wir Antonius in die Flucht.',
                            nextEventId: 'proscribed'
                        },
                        {
                            id: 'neutral',
                            text: 'Ich bleibe neutral und appelliere an den Senat.',
                            effect: { welfare: +5, influence: -5, power: -10 },
                            response: 'Meine Neutralität wird mir zum Verhängnis. Als Octavian und Antonius sich einigen, bin ich der Verlierer.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'proscribed': {
                    id: 'proscribed',
                    title: 'Geächtet',
                    description: 'Octavian und Antonius haben sich verbündet. Mein Name steht auf der Proskriptionsliste. Soldaten suchen nach mir.',
                    choices: [
                        {
                            id: 'flee',
                            text: 'Ich versuche, nach Griechenland zu fliehen.',
                            effect: { welfare: -5, influence: -10, power: -5 },
                            response: 'Ich werde auf einem Schiff entdeckt. "Ich sterbe für mein Vaterland, dem ich zu viel war." Die Soldaten töten mich.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'resist',
                            text: 'Ich stelle mich meinen Mördern mit Würde.',
                            effect: { welfare: +10, influence: +5, power: 0 },
                            response: 'Ich sterbe als römischer Bürger. Mein letzter Blick gilt der Republik, die mit mir stirbt.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'verres',
            authorId: 'cicero',
            title: 'Der Prozess gegen Verres',
            date: 'August 70 v. Chr.',
            description: 'Verres, der frühere Statthalter Siziliens, hat die Provinz ausgeplündert. Die Sizilier flehen mich an, ihn anzuklagen. Ich habe nur 110 Tage, um Beweise zu sammeln. Er hat Hortensius, den besten Anwalt Roms.',
            initialStats: {
                welfare: 50,
                influence: 40,
                power: 30
            },
            startEventId: 'preparation',
            events: {
                'preparation': {
                    id: 'preparation',
                    title: 'Die Beweisaufnahme',
                    description: 'In nur 110 Tagen reise ich durch Sizilien. Die Zeugen sind verängstigt. Verres Anhänger versuchen, mich zu bestechen und einzuschüchtern. Hortensius bereitet eine Gegenklage vor.',
                    choices: [
                        {
                            id: 'investigate',
                            text: 'Ich sammele alle Beweise – Zeugen, Dokumente, Rechnungen.',
                            effect: { welfare: +10, influence: +15, power: +10 },
                            response: 'Die Beweislast ist erdrückend. Ich halte meine erste Rede – kurz und vernichtend. Verres Gesicht wird aschfahl.',
                            nextEventId: 'trial_cicero'
                        },
                        {
                            id: 'settle',
                            text: 'Ich nehme das Schweigegeld an. Verres geht frei.',
                            effect: { welfare: -15, influence: -10, power: +5 },
                            response: 'Das Geld ist gut, aber mein Gewissen ist schwer. Die Sizilier verfluchen mich.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'trial_cicero': {
                    id: 'trial_cicero',
                    title: 'Der Prozess',
                    description: 'Das Forum ist voll. Hortensius verteidigt Verres mit aller Macht. Ich muss die Geschworenen überzeugen – nicht mit Pathos, sondern mit Beweisen.',
                    choices: [
                        {
                            id: 'facts',
                            text: 'Ich präsentiere die Beweise kühl und sachlich.',
                            effect: { welfare: +10, influence: +20, power: +15 },
                            response: '„Was werden wir morgen haben, wenn Schuld nicht mehr bestraft wird?" Verres flieht noch vor dem Urteil ins Exil. Mein Ruf als Ankläger ist gemacht.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'emotion',
                            text: 'Ich appelliere an das Rechtsgefühl der Geschworenen.',
                            effect: { welfare: +5, influence: +10, power: +5 },
                            response: 'Die Geschworenen sind bewegt, aber Hortensius kontert geschickt. Der Prozess zieht sich hin. Verres bekommt mildere Strafe.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'pro_archia',
            authorId: 'cicero',
            title: 'Für den Dichter Archias',
            date: '62 v. Chr.',
            description: 'Der Dichter Archias, mein alter Lehrer, soll ausgebürgert werden. Gegner sagen, er sei kein römischer Bürger. Ich muss ihn verteidigen – nicht nur aus Dankbarkeit, sondern für die Kunst selbst.',
            initialStats: {
                welfare: 60,
                influence: 50,
                power: 40
            },
            startEventId: 'court_cicero',
            events: {
                'court_cicero': {
                    id: 'court_cicero',
                    title: 'Vor Gericht',
                    description: 'Archias sitzt auf der Anklagebank. Einundsechzig Jahre alt, grau, aber mit leuchtenden Augen. Seine Feinde haben gefälschte Dokumente vorgelegt. Der Richter ist skeptisch.',
                    choices: [
                        {
                            id: 'legal',
                            text: 'Ich argumentiere rein juristisch mit Beweisen für sein Bürgerrecht.',
                            effect: { welfare: +5, influence: +10, power: +5 },
                            response: 'Die Beweise sind stichhaltig. Archias Gegner verstummen. Ein klarer Sieg des Rechts.',
                            nextEventId: 'speech_cicero'
                        },
                        {
                            id: 'short',
                            text: 'Ich plädiere kurz und überlasse es den Fakten.',
                            effect: { welfare: 0, influence: +5, power: 0 },
                            response: 'Das Gericht entscheidet nach Aktenlage. Archias wird freigesprochen, aber meine Rede ist vergessen.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'speech_cicero': {
                    id: 'speech_cicero',
                    title: 'Die berühmte Rede',
                    description: 'Ich spüre, dass der Fall gewonnen ist. Nun nutze ich die Gelegenheit für etwas Größeres – eine Verteidigung der Bildung und der Dichtkunst. "Denn die anderen Künste sind des Ortes, der Zeit, des Alters; diese eine aber nährt die Jugend, erfreut das Alter..."',
                    choices: [
                        {
                            id: 'eloquent',
                            text: 'Ich halte eine Rede über den Wert der Bildung und der Künste.',
                            effect: { welfare: +15, influence: +20, power: +5 },
                            response: '„Denn die anderen Künste sind des Ortes, der Zeit, des Alters; diese eine aber nährt die Jugend, erfreut das Alter, schmückt das Glück, bietet Trost und Zuflucht im Unglück." Der Saal ist still. Ich habe nicht nur Archias gerettet – ich habe die Kunst verteidigt.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'modest',
                            text: 'Ich bleibe bescheiden und rede nur über Archias.',
                            effect: { welfare: +5, influence: +5, power: 0 },
                            response: 'Archias wird freigesprochen. Eine gute Tat, aber meine schönste Rede habe ich nicht gehalten.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        }
    ],
    augustus: [
        {
            id: 'inheritance',
            authorId: 'augustus',
            title: 'Das Erbe Caesars',
            date: '17. März 44 v. Chr.',
            description: 'Ich bin 18. Caesar ist ermordet. Sein Testament macht mich zum Haupterben. Marcus Antonius hält die Hauptstadt besetzt und verweigert die Auszahlung.',
            initialStats: {
                welfare: 30,
                influence: 20,
                power: 10
            },
            startEventId: 'testament',
            events: {
                'testament': {
                    id: 'testament',
                    title: 'Die Erbschaft',
                    description: 'In Brundisium erfahre ich von Caesars Tod und meiner Adoption. Antonius spottet: "Ein Knabe soll Caesar beerben?" Meine Mutter fleht mich an, abzulehnen.',
                    choices: [
                        {
                            id: 'accept',
                            text: 'Ich nehme das Erbe an und nenne mich Gaius Iulius Caesar Octavianus.',
                            effect: { welfare: +5, influence: +15, power: +20 },
                            response: 'Die Legionen hören den Namen Caesar. Veteranen strömen zu mir. Antonius unterschätzt mich gefährlich.',
                            nextEventId: 'march_rome'
                        },
                        {
                            id: 'decline',
                            text: 'Ich lehne ab für mein eigenes Leben.',
                            effect: { welfare: +15, influence: -20, power: -30 },
                            response: 'Sicherheit, aber ohne Namen, ohne Zukunft. Antonius lacht mich aus.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'march_rome': {
                    id: 'march_rome',
                    title: 'Marsch auf Rom',
                    description: '3000 Veteranen sind mir gefolgt. Antonius verspottet mein Heer als "Knabenspielzeug". Ich brauche Geld und den Senat.',
                    choices: [
                        {
                            id: 'negotiate',
                            text: 'Ich verhandle mit dem Senat gegen Antonius.',
                            effect: { welfare: +10, influence: +10, power: +5 },
                            response: 'Cicero hält Reden für mich. Der Senat erkennt mich an. Die Macht teile ich mir noch – aber das ist nur der Anfang.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'force',
                            text: 'Ich werbe mehr Legionen an und erzwinge mein Recht.',
                            effect: { welfare: -10, influence: +5, power: +20 },
                            response: 'Bürgerkrieg droht erneut. Aber meine Legaten bestätigen: Die Armee folgt dem Namen Caesar.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'actium',
            authorId: 'augustus',
            title: 'Die Schlacht bei Actium',
            date: '2. September 31 v. Chr.',
            description: 'Antonius und Kleopatra haben ihre Flotte in Griechenland versammelt. Agrippa, mein Admiral, drängt zur Seeschlacht. Das Schicksal der römischen Welt hängt daran.',
            initialStats: {
                welfare: 60,
                influence: 70,
                power: 80
            },
            startEventId: 'before_battle',
            events: {
                'before_battle': {
                    id: 'before_battle',
                    title: 'Am Vorabend',
                    description: 'Unsere Flotte ist kleiner, aber Agrippa hat sie besser ausgebildet. Antonius Schiffe sind schwerer, aber langsamer. Kleopatra wartet mit ihrer ägyptischen Flotte.',
                    choices: [
                        {
                            id: 'attack',
                            text: 'Ich greife an – Agrippas Taktik wird siegen!',
                            effect: { welfare: -10, influence: +20, power: +30 },
                            response: 'Agrippas Manöver umzingeln Antonius. Kleopatra flieht, Antonius folgt ihr. Ich bin Herr des Mittelmeers!',
                            nextEventId: 'aftermath'
                        },
                        {
                            id: 'blockade',
                            text: 'Ich blockiere Antonius und hungere ihn aus.',
                            effect: { welfare: +10, influence: -5, power: +5 },
                            response: 'Die Blockade wirkt, aber Antonius entkommt nach Ägypten. Der Krieg zieht sich hin.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'aftermath': {
                    id: 'aftermath',
                    title: 'Der Sieg',
                    description: 'Antonius und Kleopatra sind nach Ägypten geflohen. Ich folge ihnen nach Alexandria. Der Osten liegt mir zu Füßen.',
                    choices: [
                        {
                            id: 'mercy',
                            text: 'Ich biete Antonius Gnade an, falls er sich ergibt.',
                            effect: { welfare: +15, influence: +5, power: 0 },
                            response: 'Antonius lehnt ab und begeht Selbstmord. Kleopatra folgt ihm. Ägypten wird römische Provinz.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'hunt',
                            text: 'Ich jage sie unbarmherzig bis zum Tod.',
                            effect: { welfare: -5, influence: +10, power: +15 },
                            response: 'Beide sterben. Ich sehe Kleopatras Leichnam – schön im Tod. Ägyptens Schätze sind nun mein.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'principate',
            authorId: 'augustus',
            title: 'Die Erste Ordnung',
            date: '13. Januar 27 v. Chr.',
            description: 'Der Bürgerkrieg ist vorbei. Ich halte die gesamte Macht in Händen. Der Senat erwartet meine Entscheidung. Gebe ich die Macht ab – oder werde ich König?',
            initialStats: {
                welfare: 80,
                influence: 90,
                power: 100
            },
            startEventId: 'senate_speech',
            events: {
                'senate_speech': {
                    id: 'senate_speech',
                    title: 'Die Senatssitzung',
                    description: 'Ich stehe vor dem Senat. Die Väter wissen: Ich könnte die Republik abschaffen. Sie fürchten mich und hoffen auf Milde. Was soll ich tun?',
                    choices: [
                        {
                            id: 'restore',
                            text: 'Ich gebe dem Senat die Macht zurück – scheinbar.',
                            effect: { welfare: +20, influence: +15, power: +10 },
                            response: '„Ich übergebe den Staat eurer Obhut." Der Senat ist gerührt, das Volk jubelt. Sie nennen mich Augustus. In Wahrheit behalte ich die Kontrolle.',
                            nextEventId: 'consolidate_augustus'
                        },
                        {
                            id: 'keep',
                            text: 'Ich behalte die Macht offen.',
                            effect: { welfare: -10, influence: -10, power: +10 },
                            response: 'Die Senatoren sind empört. Meine Gegner sprechen von Tyrannei. Die gleichen Fehler wie Caesar.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'consolidate_augustus': {
                    id: 'consolidate_augustus',
                    title: 'Machtausbau',
                    description: 'Ich bin Augustus, Princeps Senatus. Die Provinzen sind geteilt – ich kontrolliere die mit den Legionen. Wie sichere ich das System für die Zukunft?',
                    choices: [
                        {
                            id: 'heir',
                            text: 'Ich baue meine Familie als Nachfolger auf – Tiberius soll lernen.',
                            effect: { welfare: +10, influence: +20, power: +15 },
                            response: 'Tiberius wird mein Erbe. Das Prinzipat ist geboren: Der Princeps herrscht, Rom glaubt an die Republik.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'senate_rule',
                            text: 'Ich teile die Macht dauerhaft mit dem Senat.',
                            effect: { welfare: +15, influence: -5, power: -10 },
                            response: 'Der Senat fühlt sich geehrt, aber das System ist instabil. Ohne klare Führung kehrt das Chaos zurück.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'ara_pacis',
            authorId: 'augustus',
            title: 'Der Friedensaltar',
            date: '13 v. Chr.',
            description: 'Der Senat beschließt, einen Altar des Friedens zu errichten – die Ara Pacis. Ein Zeichen für die Pax Romana. Ich muss entscheiden: Wie soll Rom sich selbst darstellen? Als Krieger oder als Hüter des Friedens?',
            initialStats: {
                welfare: 80,
                influence: 85,
                power: 90
            },
            startEventId: 'altar_plan',
            events: {
                'altar_plan': {
                    id: 'altar_plan',
                    title: 'Der Plan',
                    description: 'Die Baumeister legen mir Entwürfe vor. Prächtig, monumental, mit Szenen meiner Siege und der Gründung Roms. Ein ewiges Denkmal.',
                    choices: [
                        {
                            id: 'peace',
                            text: 'Der Altar soll den Frieden feiern – nicht den Krieg.',
                            effect: { welfare: +15, influence: +10, power: +5 },
                            response: 'Die Ara Pacis zeigt meine Familie, die Priester, das Volk – im Frieden vereint. Rom versteht: Eine neue Ära hat begonnen.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'glory',
                            text: 'Der Altar soll meine militärischen Siege zeigen.',
                            effect: { welfare: -5, influence: +10, power: +15 },
                            response: 'Die Ara Pacis wird ein Triumphmal. Die Veteranen lieben es, aber die Friedensparteien sind enttäuscht.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'succession',
            authorId: 'augustus',
            title: 'Die Nachfolge',
            date: '4 n. Chr.',
            description: 'Meine Enkel Gaius und Lucius sind tot. Tiberius ist mein letzter erwachsener Erbe. Ich mag ihn nicht – aber er ist der fähigste. Der Senat wartet auf meine Entscheidung.',
            initialStats: {
                welfare: 75,
                influence: 80,
                power: 95
            },
            startEventId: 'heir_choice',
            events: {
                'heir_choice': {
                    id: 'heir_choice',
                    title: 'Die Wahl des Erben',
                    description: 'Tiberius ist verbittert, zieht sich nach Rhodos zurück. Germanicus, sein Neffe, ist beliebter beim Volk. Livia drängt mich zu Tiberius. Der Senat schweigt abwartend.',
                    choices: [
                        {
                            id: 'tiberius',
                            text: 'Ich adoptiere Tiberius – er ist der erfahrenste Feldherr.',
                            effect: { welfare: +5, influence: +15, power: +20 },
                            response: 'Tiberius wird mein Sohn und Erbe. Er ist nicht der Herrscher, den ich mir wünsche, aber der, den Rom braucht. Germanicus wird sein Nachfolger.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'germanicus',
                            text: 'Ich setze Germanicus als Erben ein – das Volk liebt ihn.',
                            effect: { welfare: +15, influence: +5, power: -5 },
                            response: 'Germanicus ist jung, aber unerfahren. Die Legionen jubeln. Tiberius ist tödlich beleidigt. Die Saat für künftige Konflikte ist gelegt.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        }
    ],
    seneca: [
        {
            id: 'neros_advisor',
            authorId: 'seneca',
            title: 'Der Erzieher Neros',
            date: '54 n. Chr.',
            description: 'Claudius ist tot. Agrippina hat Nero zum Kaiser gemacht. Ich bin sein Erzieher und Berater. Der junge Kaiser ist 17 – formbar, aber voller Machtgelüste.',
            initialStats: {
                welfare: 70,
                influence: 60,
                power: 40
            },
            startEventId: 'first_council',
            events: {
                'first_council': {
                    id: 'first_council',
                    title: 'Der erste kaiserliche Rat',
                    description: 'Nero empfängt mich. Er will seinen Willen durchsetzen: Pferderennen, Schauspiele, Verschwendung. Ich soll seine erste Rede an den Senat schreiben.',
                    choices: [
                        {
                            id: 'moderate',
                            text: 'Ich schreibe eine gemäßigte Rede über Milde und Gerechtigkeit.',
                            effect: { welfare: +15, influence: +10, power: +5 },
                            response: 'Der Senat ist begeistert. „Welch ein Kaiser!" Sie nennen es die Goldene Zeit. Nero genießt den Ruhm.',
                            nextEventId: 'power_struggle'
                        },
                        {
                            id: 'strict',
                            text: 'Ich halte eine stoische Mahnrede über Pflicht und Verantwortung.',
                            effect: { welfare: +5, influence: +5, power: 0 },
                            response: 'Nero hört höflich zu, aber ich sehe Langeweile in seinen Augen. Meine Philosophie langweilt ihn.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'power_struggle': {
                    id: 'power_struggle',
                    title: 'Der Machtkampf',
                    description: 'Agrippina will Nero beherrschen. Burrus, der Prätorianerpräfekt, steht zwischen uns. Nero beginnt, sich gegen seine Mutter aufzulehnen.',
                    choices: [
                        {
                            id: 'mediate',
                            text: 'Ich versuche, zwischen Nero und Agrippina zu vermitteln.',
                            effect: { welfare: +10, influence: +5, power: +5 },
                            response: 'Der Vermittlungsversuch scheitert. Nero hasst seine Mutter zunehmend. Agrippina hasst mich dafür, dass ich Nero unterstütze.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'side',
                            text: 'Ich unterstütze Nero gegen seine Mutter.',
                            effect: { welfare: -5, influence: +15, power: +15 },
                            response: 'Nero dankt es mir – vorerst. Ohne Agrippinas Einfluss wird Nero immer unkontrollierbarer.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'piso_conspiracy',
            authorId: 'seneca',
            title: 'Die Pisonische Verschwörung',
            date: 'April 65 n. Chr.',
            description: 'Nero hat sich zum Tyrannen entwickelt. Man flüstert von einer Verschwörung. Piso, ein angesehener Senator, plant Neros Sturz. Mein Name wird genannt.',
            initialStats: {
                welfare: 50,
                influence: 70,
                power: 60
            },
            startEventId: 'the_offer',
            events: {
                'the_offer': {
                    id: 'the_offer',
                    title: 'Das Angebot',
                    description: 'Ein Bote Pisos erreicht mich in meiner Villa. "Der Senat ist mit dir. Nero muss fallen. Übernimm die Führung." Ich weiß: Dies ist der Moment der Entscheidung.',
                    choices: [
                        {
                            id: 'join',
                            text: 'Ich schließe mich der Verschwörung an für Roms Freiheit.',
                            effect: { welfare: +15, influence: +10, power: +5 },
                            response: 'Die Verschwörung wächst. Aber ein Sklave verrät uns. Neros Soldaten kommen. Die Philosophie lehrt mich, den Tod zu umarmen.',
                            nextEventId: 'death'
                        },
                        {
                            id: 'refuse',
                            text: 'Ich lehne ab. Philosophie ist mein Weg, nicht Politik.',
                            effect: { welfare: +10, influence: +5, power: -5 },
                            response: 'Piso wird hingerichtet. Nero sucht nach Mitwissern. Mein Name fällt dennoch – ein eifersüchtiger Höfling hat mich genannt.',
                            nextEventId: 'death'
                        }
                    ]
                },
                'death': {
                    id: 'death',
                    title: 'Der letzte Brief',
                    description: 'Die Prätorianer umstellen meine Villa. Ein Zenturio überbringt Neros Befehl: Ich soll mich selbst töten. Meine Freunde weinen. Wie stirbt ein Stoiker?',
                    choices: [
                        {
                            id: 'dignified',
                            text: 'Ich öffne meine Adern und diktiere noch einmal der Philosophie.',
                            effect: { welfare: +10, influence: +20, power: 0 },
                            response: 'Mein Blut fließt langsam. Ich diktiere Lucilius ein letztes Mal. Die Philosophie war mein Leben – sie ist auch mein Tod. "Wozu die Mühe? Was bleibt, ist Frieden."',
                            nextEventId: 'END'
                        },
                        {
                            id: 'plead',
                            text: 'Ich bitte um Gnade und biete mein Vermögen an.',
                            effect: { welfare: 0, influence: -15, power: -5 },
                            response: 'Nero lehnt ab. Ich sterbe erniedrigt. Kein philosophisches Vermächtnis, nur Scham.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'exile',
            authorId: 'seneca',
            title: 'Das Exil auf Korsika',
            date: '41 n. Chr.',
            description: 'Kaiser Claudius hat mich nach Korsika verbannt. Messalina, seine Frau, hasst mich. Die Insel ist eine öde, felsige Einöde. Acht Jahre Verbannung – oder mein ganzes Leben? Die Philosophie ist mein einziger Trost.',
            initialStats: {
                welfare: 20,
                influence: 10,
                power: 5
            },
            startEventId: 'exile_start',
            events: {
                'exile_start': {
                    id: 'exile_start',
                    title: 'Ankunft auf Korsika',
                    description: 'Das Schiff legt an. Kahle Berge, ein paar elende Hütten. Der Wind heult. Meine Begleiter weinen. "Warum?" fragen sie mich. Ich blicke auf das Meer und denke an die Stoa.',
                    choices: [
                        {
                            id: 'philosophy',
                            text: 'Ich ertrage mein Schicksal mit stoischer Gelassenheit – Trost in der Philosophie.',
                            effect: { welfare: +10, influence: +15, power: +5 },
                            response: 'Ich beginne zu schreiben – Tröstungen an meine Mutter, Briefe an Freunde. "Der Weise ist überall zu Hause, denn er trägt seine Heimat in sich." Die Jahre im Exil werden meine fruchtbarsten.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'despair',
                            text: 'Ich verfalle in Bitterkeit und Selbstmitleid.',
                            effect: { welfare: -10, influence: -10, power: -5 },
                            response: 'Die Jahre vergehen in Hoffnungslosigkeit. Als Agrippina mich zurückruft, bin ich ein gebrochener Mann ohne literarisches Erbe.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'de_brevitate',
            authorId: 'seneca',
            title: 'Über die Kürze des Lebens',
            date: '49 n. Chr.',
            description: 'Zurück in Rom, von Agrippina zurückgeholt. Ich sehe die Menschen um mich hetzen, rackern, ihr Leben verschwenden. Paulinus, der Ritter, beschwert sich über zu wenig Zeit. Ich muss ihm antworten.',
            initialStats: {
                welfare: 50,
                influence: 50,
                power: 30
            },
            startEventId: 'paulinus_visit',
            events: {
                'paulinus_visit': {
                    id: 'paulinus_visit',
                    title: 'Der Besuch des Paulinus',
                    description: 'Paulinus, ein vielbeschäftigter römischer Ritter, sitzt in meinem Atrium. "Seneca, ich habe einfach keine Zeit! Der Staat, die Geschäfte, die Klienten – das Leben ist zu kurz!" Er sieht erschöpft aus.',
                    choices: [
                        {
                            id: 'teach',
                            text: 'Ich erkläre ihm: "Nicht das Leben ist kurz, wir machen es kurz."',
                            effect: { welfare: +10, influence: +15, power: +5 },
                            response: 'Ich diktiere ihm meine Gedanken: "Das Leben ist lang genug, wenn man es richtig nutzt." Meine Schrift "De Brevitate Vitae" wird geboren – ein Bestseller der Philosophie.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'advise',
                            text: 'Ich rate ihm praktisch: Delegiere, vereinfache, konzentriere dich.',
                            effect: { welfare: +15, influence: +5, power: 0 },
                            response: 'Paulinus folgt meinem Rat und wird glücklicher. Aber meine Gedanken schreibe ich nicht auf – die Nachwelt verliert ein Meisterwerk.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        }
    ],
    catilina: [
        {
            id: 'conspiracy_begins',
            authorId: 'catilina',
            title: 'Die Verschwörung beginnt',
            date: 'Juni 64 v. Chr.',
            description: 'Wieder habe ich die Konsulwahl verloren. Cicero, dieser Emporkömmling, hat gewonnen. Schulden erdrücken mich. Meine Anhänger fordern Taten – der Staat muss erzittern!',
            initialStats: {
                welfare: 30,
                influence: 40,
                power: 25
            },
            startEventId: 'secret_meeting',
            events: {
                'secret_meeting': {
                    id: 'secret_meeting',
                    title: 'Die geheime Versammlung',
                    description: 'In meinem Haus in Rom versammeln sich Verschwörer: P. Cornelius Lentulus Sura, C. Manlius, römische Ritter und verarmte Veteranen. Sie wollen Blut.',
                    choices: [
                        {
                            id: 'conspire',
                            text: 'Ich schmiede einen Plan: Brandstiftung in Rom, Mord an Senatoren, dann der Umsturz!',
                            effect: { welfare: -15, influence: +20, power: +25 },
                            response: 'Der Plan ist kühn. Meine Männer sind bereit. Aber Cicero hat überall Spione. Nichts bleibt ihm verborgen.',
                            nextEventId: 'spread'
                        },
                        {
                            id: 'moderate',
                            text: 'Ich versuche es auf legalem Weg – erneute Kandidatur.',
                            effect: { welfare: +10, influence: -10, power: -5 },
                            response: 'Cicero weiß meine Pläne und blockiert mich erneut. Ohne Gewalt werde ich nie Konsul.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'spread': {
                    id: 'spread',
                    title: 'Der Umsturzplan',
                    description: 'Manlius sammelt ein Heer in Etrurien. Fannius und Capito verteilen Flugblätter. Cicero hält erste Reden gegen mich – noch ohne Beweise.',
                    choices: [
                        {
                            id: 'deny',
                            text: 'Ich gehe in den Senat und leugne alles – frech und direkt.',
                            effect: { welfare: +5, influence: +10, power: +5 },
                            response: 'Cicero durchschaut mich. In seiner nächsten Rede wird er mich vor dem ganzen Senat bloßstellen.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'strike',
                            text: 'Ich schlage zu, bevor Cicero handeln kann!',
                            effect: { welfare: -10, influence: +15, power: +20 },
                            response: 'Zu früh! Cicero hat bereits die Prätorianer alarmiert. Ich muss aus Rom fliehen.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'pistoria',
            authorId: 'catilina',
            title: 'Die Schlacht bei Pistoria',
            date: 'Anfang 62 v. Chr.',
            description: 'Ich bin aus Rom geflohen. Mein Heer in Etrurien zählt etwa 3000 Mann. Der Senat hat Antonius Hybrida mit einem Heer gegen mich geschickt. Es gibt kein Zurück.',
            initialStats: {
                welfare: 30,
                influence: 35,
                power: 50
            },
            startEventId: 'last_stand',
            events: {
                'last_stand': {
                    id: 'last_stand',
                    title: 'Die letzte Schlacht',
                    description: 'Meine Männer sind erschöpft, aber loyal. Die Senatstruppen rücken näher. Wir kämpfen oder kapitulieren. Ein Bote des Antonius bietet freien Abzug, wenn ich aufgebe.',
                    choices: [
                        {
                            id: 'fight',
                            text: 'Ich stelle mich der Schlacht lieber als freier Mann!',
                            effect: { welfare: -10, influence: +10, power: -10 },
                            response: 'Ich ordne die Schlachtreihen. Meine Männer kämpfen wie Löwen. Als falle alles vor mir, denke ich an Rom. Der Tod kommt schnell.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'surrender',
                            text: 'Ich ergebe mich – vielleicht gibt es Milde.',
                            effect: { welfare: +10, influence: -20, power: -30 },
                            response: 'Cicero fordert meine Hinrichtung. Der Senat stimmt zu. Ich sterbe als Verräter, nicht als Soldat.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'sulla_legacy',
            authorId: 'catilina',
            title: 'Sullas Erbe',
            date: '82 v. Chr.',
            description: 'Sulla, der Diktator, belohnt seine Anhänger mit Proskriptionen – Ächtung und Ermordung seiner Feinde. Ich bin ein junger Offizier. Seine Methoden sind brutal, aber effektiv. Folgt man dem Gesetz oder der Macht?',
            initialStats: {
                welfare: 20,
                influence: 15,
                power: 25
            },
            startEventId: 'sulla_choice',
            events: {
                'sulla_choice': {
                    id: 'sulla_choice',
                    title: 'Sullas Befehl',
                    description: 'Sulla befiehlt mir, einen geächteten Senator zu töten. Der Mann war einst mein Nachbar. Er fleht um sein Leben. Sulla beobachtet mich – ein Test meiner Loyalität.',
                    choices: [
                        {
                            id: 'obey',
                            text: 'Ich töte den Mann. Sulla hat das Gesetz auf seiner Seite.',
                            effect: { welfare: -10, influence: +15, power: +20 },
                            response: 'Sulla nickt anerkennend. Ich erhalte Land und Beute. Aber der erste Blutfleck sitzt tief. Die Proskriptionen lehren mich: Macht macht alles erlaubt.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'refuse',
                            text: 'Ich weigere mich – ich bin Soldat, kein Henker.',
                            effect: { welfare: +15, influence: -10, power: -10 },
                            response: 'Ich verliere Sullas Gunst. Meine Karriere stockt. Ich bleibe arm, aber sauber – bis die Verbitterung wächst.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'election_63',
            authorId: 'catilina',
            title: 'Die verlorene Wahl',
            date: 'Juli 63 v. Chr.',
            description: 'Zum zweiten Mal bewerbe ich mich um das Konsulat. Cicero ist mein Gegner. Die Nobilität hasst mich. Ich habe Schulden, aber ich habe Pläne. Das Volk liebt mich – das muss reichen.',
            initialStats: {
                welfare: 35,
                influence: 45,
                power: 30
            },
            startEventId: 'election_day',
            events: {
                'election_day': {
                    id: 'election_day',
                    title: 'Der Wahltag',
                    description: 'Das Marsfeld ist voll. Ich sehe Cicero in seiner weißen Toga, umringt von Optimaten. Meine Anhänger skandieren meinen Namen. Die Stimmung ist aufgeheizt.',
                    choices: [
                        {
                            id: 'campaign',
                            text: 'Ich verspreche Schuldenerlass und Land für die Armen.',
                            effect: { welfare: +15, influence: +10, power: +5 },
                            response: 'Die Armen jubeln. Aber Cicero hat den Senat und das Geld. Er gewinnt. Wieder. Die Verzweiflung treibt mich zur Radikalität.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'intimidate',
                            text: 'Ich schüchtere die Wähler ein – mit Gladiatoren und Banden.',
                            effect: { welfare: -10, influence: +5, power: +15 },
                            response: 'Die Gewalt eskaliert. Cicero verhängt den Ausnahmezustand. Ich verliere die Wahl, aber mein Name ist in aller Munde – als Bedrohung der Republik.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        }
    ],
    sallust: [
        {
            id: 'tribunate',
            authorId: 'sallust',
            title: 'Das Volkstribunat',
            date: '52 v. Chr.',
            description: 'Ich bin Volkstribun. Clodius wurde ermordet, Milo angeklagt. Die Straßen Roms sind voller Banden. Der Senat ist handlungsunfähig. Meine Stimme zählt.',
            initialStats: {
                welfare: 40,
                influence: 30,
                power: 20
            },
            startEventId: 'tribune_speech',
            events: {
                'tribune_speech': {
                    id: 'tribune_speech',
                    title: 'Die Rede auf dem Forum',
                    description: 'Die Menge drängt sich. Milo hat Clodius getötet. Pompeius ist zum alleinigen Konsul ernannt worden. Soll ich Milo verteidigen oder der Gewalt abschwören?',
                    choices: [
                        {
                            id: 'attack',
                            text: 'Ich klage Milo an – die Clodianer sind zahlreich und gefährlich.',
                            effect: { welfare: -5, influence: +15, power: +10 },
                            response: 'Meine Rede heizt die Stimmung an. Milo wird verurteilt. Pompeius nickt mir zu. Aber mein Gewissen ist schwer.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'defend',
                            text: 'Ich verteidige Milo und die Rechtsordnung.',
                            effect: { welfare: +10, influence: -5, power: -5 },
                            response: 'Ciceros Rede ist besser – Milo geht ins Exil. Ich gelte als idealistisch, aber schwach.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'historian',
            authorId: 'sallust',
            title: 'Der Historiker',
            date: '44 v. Chr.',
            description: 'Caesar ist tot. Ich habe mich aus der Politik zurückgezogen. In meiner Villa in den Quirinalien schreibe ich. Die Catilinarische Verschwörung drängt mich – ich muss sie aufzeichnen.',
            initialStats: {
                welfare: 60,
                influence: 50,
                power: 30
            },
            startEventId: 'write_or_not',
            events: {
                'write_or_not': {
                    id: 'write_or_not',
                    title: 'Wahl des Stoffes',
                    description: 'Soll ich über die Catilinarische Verschwörung schreiben oder lieber den Jugurthinischen Krieg? Die Quellen sind unterschiedlich – und die Deutung ohnehin gefährlich.',
                    choices: [
                        {
                            id: 'catilina',
                            text: 'Ich schreibe über die Catilinarische Verschwörung – ein Sittenbild Roms.',
                            effect: { welfare: +5, influence: +20, power: +15 },
                            response: 'Die Catilinae Coniuratio wird mein Meisterwerk. Scharf urteile ich über den Verfall der Sitten. Cicero und Caesar, beide kritisch beleuchtet.',
                            nextEventId: 'approach'
                        },
                        {
                            id: 'jugurtha',
                            text: 'Ich schreibe über den Jugurthinischen Krieg – Korruption in der nobilitas.',
                            effect: { welfare: +10, influence: +10, power: +10 },
                            response: 'Das Bellum Iugurthinum ist eine scharfe Abrechnung mit der römischen Aristokratie. Bestens.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'approach': {
                    id: 'approach',
                    title: 'Der moralische Anspruch',
                    description: 'Ich muss entscheiden: Schone ich die Mächtigen oder schreibe ich die Wahrheit? Cicero lebt noch. Caesars Anhänger sind mächtig.',
                    choices: [
                        {
                            id: 'truth',
                            text: 'Ich schreibe die Wahrheit, schonungslos und kritisch.',
                            effect: { welfare: +15, influence: +10, power: -5 },
                            response: 'Meine Historiae werden berühmt. „Die Republik ist an ihrer eigenen Größe zugrunde gegangen." Manche hassen mich, aber alle lesen mich.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'diplomatic',
                            text: 'Ich schreibe diplomatisch, um meine Position zu schützen.',
                            effect: { welfare: +5, influence: -5, power: +5 },
                            response: 'Meine Werke sind vergessen. Keiner erinnert sich an einen Historiker, der keine Haltung hat.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'africa',
            authorId: 'sallust',
            title: 'Statthalter von Africa Nova',
            date: '46 v. Chr.',
            description: 'Caesar hat mich zum Statthalter der neuen Provinz Africa Nova ernannt. Eine reiche Provinz – und eine gefährliche. Die Stämme sind unruhig, die Steuern fließen spärlich. Hier kann ich Reichtum oder Ruin finden.',
            initialStats: {
                welfare: 40,
                influence: 35,
                power: 45
            },
            startEventId: 'arrival',
            events: {
                'arrival': {
                    id: 'arrival',
                    title: 'Ankunft in Utica',
                    description: 'Die Hauptstadt Africa Novas empfängt mich mit gemischten Gefühlen. Die Händler bieten Geschenke – Bestechung. Die Stammesführer fordern Tribut. Die Legionen sind undiszipliniert.',
                    choices: [
                        {
                            id: 'just',
                            text: 'Ich regiere gerecht, bestrafe Korruption und gewinne das Vertrauen.',
                            effect: { welfare: +15, influence: +10, power: +5 },
                            response: 'Die Provinz blüht unter meiner gerechten Herrschaft. Aber ich mache Feinde unter den Händlern. Sie werden mich in Rom anklagen.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'enrich',
                            text: 'Ich bereichere mich wie alle anderen auch – die Gelegenheit ist zu gut.',
                            effect: { welfare: -10, influence: +5, power: +15 },
                            response: 'Ich werde reich, aber mein Ruf ist ruiniert. In Rom klagt man mich der Erpressung an. Die Geschichte wird mich als korrupten Statthalter erinnern.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'moral_decline',
            authorId: 'sallust',
            title: 'Vom Verfall der Sitten',
            date: '40 v. Chr.',
            description: 'Ich habe mich aus der Politik zurückgezogen. Rom versinkt im Bürgerkrieg. Ich schreibe die Geschichte auf – und ich sehe ein Muster. Die Republik stirbt an ihrer eigenen Größe, an Habgier und Machtmissbrauch.',
            initialStats: {
                welfare: 50,
                influence: 40,
                power: 20
            },
            startEventId: 'writing_sallust',
            events: {
                'writing_sallust': {
                    id: 'writing_sallust',
                    title: 'Die Feder oder das Schwert',
                    description: 'Soll ich meine Historiae schreiben oder noch einmal in die Politik gehen? Antonius bietet mir ein Amt an. Caesar ist tot. Die Zukunft Roms ist ungewiss.',
                    choices: [
                        {
                            id: 'history',
                            text: 'Ich schreibe – die Wahrheit ist mächtiger als das Schwert.',
                            effect: { welfare: +10, influence: +15, power: +5 },
                            response: 'In meiner Villa schreibe ich die Geschichte der Verschwörung Catilinas und des Jugurthinischen Kriegs. Ich enthülle die Korruption. Meine Werke überdauern die Imperien.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'politics',
                            text: 'Ich kehre in die Politik zurück – vielleicht kann ich noch etwas bewegen.',
                            effect: { welfare: +5, influence: 0, power: +10 },
                            response: 'Die Politik ist noch schmutziger als in meiner Erinnerung. Ich scheitere und ziehe mich endgültig zurück – ohne mein historisches Werk.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        }
    ],
    sokrates: [
        {
            id: 'trial',
            authorId: 'sokrates',
            title: 'Der Prozess',
            date: '399 v. Chr.',
            description: 'Drei Kläger – Meletos, Anytos, Lykon – haben mich angeklagt: Asebie (Gottlosigkeit) und Verführung der Jugend. 500 Richter sitzen zu Gericht. Mein Leben steht auf dem Spiel.',
            initialStats: {
                welfare: 50,
                influence: 60,
                power: 20
            },
            startEventId: 'defense',
            events: {
                'defense': {
                    id: 'defense',
                    title: 'Die Verteidigungsrede',
                    description: 'Das Gericht erwartet, dass ich flehe und Reue zeige. Aber ich bin 70 Jahre alt. Ich habe mein Leben der Wahrheitssuche gewidmet. Soll ich jetzt lügen?',
                    choices: [
                        {
                            id: 'philosophy',
                            text: 'Ich verteidige mich wie immer – mit Ironie und Dialektik.',
                            effect: { welfare: +5, influence: +20, power: 0 },
                            response: '„Ich bin die Stechmücke am Pferd Athen." Die Richter sind erzürnt. Sie finden mich schuldig – mit knapper Mehrheit.',
                            nextEventId: 'penalty'
                        },
                        {
                            id: 'plead',
                            text: 'Ich bitte um Milde und schlage Verbannung vor.',
                            effect: { welfare: +10, influence: -10, power: -5 },
                            response: 'Die Richter sind überrascht. Einige stimmen für Freispruch. Doch ich verliere mein Gesicht.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'penalty': {
                    id: 'penalty',
                    title: 'Das Strafmaß',
                    description: 'Schuldig. Nun muss ich eine Gegenstrafe vorschlagen. Die Ankläger fordern den Tod. Ich könnte Verbannung oder eine Geldstrafe vorschlagen.',
                    choices: [
                        {
                            id: 'defiant',
                            text: 'Ich schlage vor: lebenslange kostenlose Verpflegung im Prytaneion!',
                            effect: { welfare: -5, influence: +15, power: -5 },
                            response: 'Die Richter sind empört über meine Frechheit. Sie verurteilen mich zum Tod durch den Schierlingsbecher mit 280 gegen 220 Stimmen.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'fine',
                            text: 'Ich biete eine geringe Geldstrafe an – 30 Minen. Platon bürgt.',
                            effect: { welfare: +5, influence: +5, power: 0 },
                            response: 'Die Richter akzeptieren die Geldstrafe. Ich lebe weiter. Aber die Komödie der Athener Demokratie habe ich durchschaut.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'eschaton',
            authorId: 'sokrates',
            title: 'Der letzte Tag',
            date: '399 v. Chr.',
            description: 'Der Tod durch den Schierlingstrank steht bevor. Meine Freunde – Platon, Kriton, Apollodor – sind bei mir. Der Gefängniswärter weint. Ich soll den Kelch leeren, wenn die Sonne untergeht.',
            initialStats: {
                welfare: 30,
                influence: 70,
                power: 10
            },
            startEventId: 'escape_offer',
            events: {
                'escape_offer': {
                    id: 'escape_offer',
                    title: 'Der Fluchtplan',
                    description: 'Kriton flüstert: „Ich habe die Wächter bestochen, ein Schiff wartet in Piräus. Flieh nach Thessalien!" Einfach weggehen, alles hinter mir lassen.',
                    choices: [
                        {
                            id: 'stay',
                            text: 'Ich bleibe. „Nicht das Leben, sondern das gute Leben ist es, worauf es ankommt."',
                            effect: { welfare: +10, influence: +25, power: +5 },
                            response: 'Ich lehre meine Freunde ein letztes Mal: Die Seele ist unsterblich. Wer gut gelebt hat, hat nichts zu fürchten. Ich trinke den Kelch – ruhig, ohne Zittern.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'escape',
                            text: 'Ich fliehe – 70 Jahre sind genug Weisheit für Athen.',
                            effect: { welfare: +15, influence: -20, power: -5 },
                            response: 'In Thessalien lebe ich vergessen. Ohne meinen Tod wäre ich vielleicht nie zum Mythos geworden. Die Schüler zerstreuen sich.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'oracle',
            authorId: 'sokrates',
            title: 'Das Orakel von Delphi',
            date: '~430 v. Chr.',
            description: 'Mein Freund Chaerephon hat das Orakel von Delphi befragt: "Wer ist der weiseste Mensch?" Die Pythia antwortete: "Sokrates." Ich kann es nicht glauben – ich weiß doch, dass ich nichts weiß.',
            initialStats: {
                welfare: 50,
                influence: 40,
                power: 10
            },
            startEventId: 'oracle_news',
            events: {
                'oracle_news': {
                    id: 'oracle_news',
                    title: 'Die Nachricht',
                    description: 'Chaerephon kommt aufgeregt aus Delphi zurück. "Sokrates, der Gott selbst nennt dich den weisesten aller Menschen!" Ich muss der Sache auf den Grund gehen – ich werde die weisen Männer Athens befragen.',
                    choices: [
                        {
                            id: 'question',
                            text: 'Ich befrage die Politiker, Dichter und Handwerker.',
                            effect: { welfare: 0, influence: +15, power: +5 },
                            response: 'Sie alle glauben, weise zu sein, aber keiner ist es wirklich. Ich habe viele Feinde gemacht. Der Spruch des Orakels ist rätselhafter denn je.',
                            nextEventId: 'realization'
                        },
                        {
                            id: 'ignore',
                            text: 'Ich ignoriere das Orakel und lebe ruhig weiter.',
                            effect: { welfare: +10, influence: -10, power: -5 },
                            response: 'Ein ruhiges Leben, aber die Wahrheit bleibt unerforscht. Das Orakel hatte recht: Ich bin der weiseste, weil ich es nicht wissen will.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'realization': {
                    id: 'realization',
                    title: 'Die Erkenntnis',
                    description: 'Nach vielen Gesprächen verstehe ich: Ich bin der weiseste, weil ich als einziger zugebe, nichts zu wissen. Diese Einsicht ist der Beginn aller Philosophie.',
                    choices: [
                        {
                            id: 'teach',
                            text: 'Ich widme mein Leben der Suche nach Wahrheit und lehre die Jugend.',
                            effect: { welfare: +10, influence: +25, power: +5 },
                            response: 'Die Jugend folgt mir. Die Mächtigen fürchten mich. Der Weg zur Wahrheit ist mein Leben – koste es, was es wolle.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'private',
                            text: 'Ich behalte die Erkenntnis für mich.',
                            effect: { welfare: +5, influence: +5, power: 0 },
                            response: 'Ein ruhiges Philosophenleben, aber was ist Weisheit wert, wenn man sie nicht teilt?',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        },
        {
            id: 'alcibiades',
            authorId: 'sokrates',
            title: 'Alkibiades und der Krieg',
            date: '415 v. Chr.',
            description: 'Alkibiades, mein genialster und gefährlichster Schüler, will Athen in eine Invasion Siziliens treiben. Er ist jung, schön, ehrgeizig – und ich sehe den Untergang voraus.',
            initialStats: {
                welfare: 60,
                influence: 50,
                power: 20
            },
            startEventId: 'debate',
            events: {
                'debate': {
                    id: 'debate',
                    title: 'Die Volksversammlung',
                    description: 'Alkibiades redet der Menge nach dem Mund. Nikias warnt vor der Katastrophe. Das Volk ist wie berauscht vom Traum Siziliens. Man fragt auch mich um Rat.',
                    choices: [
                        {
                            id: 'warn',
                            text: 'Ich warne das Volk: "Ihr folgt einem Verblendeten ins Verderben!"',
                            effect: { welfare: +10, influence: +15, power: -5 },
                            response: 'Das Volk hört nicht auf mich. Alkibiades lacht. Aber in einigen Augen sehe ich den Zweifel. Der Same ist gesät.',
                            nextEventId: 'aftermath_alc'
                        },
                        {
                            id: 'silent',
                            text: 'Ich schweige. Die Athener müssen ihren eigenen Weg gehen.',
                            effect: { welfare: -5, influence: -5, power: 0 },
                            response: 'Die Flotte sticht in See. Ich bleibe in Athen zurück mit einem mulmigen Gefühl.',
                            nextEventId: 'END'
                        }
                    ]
                },
                'aftermath_alc': {
                    id: 'aftermath_alc',
                    title: 'Sizilien und die Folgen',
                    description: 'Die katastrophale Nachricht erreicht Athen: Die gesamte Flotte ist vernichtet. Alkibiades ist zu den Spartanern übergelaufen. Tausende tot. Die Stadt trauert.',
                    choices: [
                        {
                            id: 'stay_athens',
                            text: 'Ich bleibe in Athen und versuche, die Jugend zur Besonnenheit zu führen.',
                            effect: { welfare: +15, influence: +10, power: -5 },
                            response: 'Die Stadt ist am Boden, aber die Philosophie lebt. Ich lehre weiter, während ringsum die Welt verbrennt.',
                            nextEventId: 'END'
                        },
                        {
                            id: 'flee_city',
                            text: 'Ich verlasse Athen – die Stadt hat ihren Verstand verloren.',
                            effect: { welfare: +5, influence: -10, power: 0 },
                            response: 'Ich fliehe vor dem Wahnsinn. Aber die Fragen folgen mir überallhin.',
                            nextEventId: 'END'
                        }
                    ]
                }
            }
        }
    ],
};
