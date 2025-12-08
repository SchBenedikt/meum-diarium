
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
        }
    ]
};
