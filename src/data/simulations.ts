
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
                        }
                    ]
                }
            }
        }
    ]
};
