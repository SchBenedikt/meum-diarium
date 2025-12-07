import { Work } from '@/types/blog';


export const works: Record<string, Work> = {
    'de-bello-gallico': {
        title: 'De Bello Gallico',
        author: 'caesar',
        year: '58 – 50 v. Chr.',
        summary: 'Caesars eigener Bericht über seine Feldzüge in Gallien. Ein Meisterwerk der politischen Propaganda und nüchternen Berichterstattung.',
        takeaway: 'Gallien ist ganz in drei Teile geteilt...',
        structure: [
            { title: 'Buch I (58 v. Chr.)', content: 'Der Helvetierkrieg und der Krieg gegen Ariovist.' },
            { title: 'Buch II (57 v. Chr.)', content: 'Unterwerfung der belgischen Stämme im Nordosten.' },
            { title: 'Buch III (57/56 v. Chr.)', content: 'Kämpfe in den Alpen und an der Atlantikküste.' },
            { title: 'Buch IV (55 v. Chr.)', content: 'Erster Übergang über den Rhein und erste Expedition nach Britannien.' },
            { title: 'Buch V (54 v. Chr.)', content: 'Zweite Britannien-Expedition und Aufstände in Gallien.' },
            { title: 'Buch VI (53 v. Chr.)', content: 'Zweiter Rheinübergang, Exkurs über gallische Sitten, Rachezug gegen Eburonen.' },
            { title: 'Buch VII (52 v. Chr.)', content: 'Der große Aufstand des Vercingetorix, Belagerung von Alesia.' },
            { title: 'Buch VIII (51/50 v. Chr.)', content: 'Abschluss der Kämpfe (geschrieben von Aulus Hirtius).' }
        ],
        translations: {
            de: {
                title: 'De Bello Gallico (Der Gallische Krieg)',
                summary: 'Caesars eigener Bericht über seine Feldzüge in Gallien. Ein Meisterwerk der politischen Propaganda und nüchternen Berichterstattung.',
                takeaway: 'Eines der berühmtesten Werke der Weltliteratur, beginnend mit: "Gallia est omnis divisa in partes tres..."',
                structure: [
                    { title: 'Buch I (58 v. Chr.)', content: 'Der Helvetierkrieg und der Krieg gegen Ariovist.' },
                    { title: 'Buch II (57 v. Chr.)', content: 'Unterwerfung der belgischen Stämme im Nordosten.' },
                    { title: 'Buch III (57/56 v. Chr.)', content: 'Kämpfe in den Alpen und an der Atlantikküste.' },
                    { title: 'Buch IV (55 v. Chr.)', content: 'Erster Übergang über den Rhein und erste Expedition nach Britannien.' },
                    { title: 'Buch V (54 v. Chr.)', content: 'Zweite Britannien-Expedition und Aufstände in Gallien.' },
                    { title: 'Buch VI (53 v. Chr.)', content: 'Zweiter Rheinübergang, Exkurs über gallische Sitten, Rachezug gegen Eburonen.' },
                    { title: 'Buch VII (52 v. Chr.)', content: 'Der große Aufstand des Vercingetorix, Belagerung von Alesia.' },
                    { title: 'Buch VIII (51/50 v. Chr.)', content: 'Abschluss der Kämpfe (geschrieben von Aulus Hirtius).' }
                ]
            },
            en: {
                title: 'De Bello Gallico (The Gallic War)',
                summary: 'Caesar\'s own account of his campaigns in Gaul. A masterpiece of political propaganda and sober reporting.',
                takeaway: 'One of the most famous works of world literature, beginning with: "All Gaul is divided into three parts..."',
                structure: [
                    { title: 'Book I (58 BC)', content: 'The Helvetian War and the war against Ariovistus.' },
                    { title: 'Book II (57 BC)', content: 'Subjugation of the Belgian tribes in the northeast.' },
                    { title: 'Book III (57/56 BC)', content: 'Campaigns in the Alps and on the Atlantic coast.' },
                    { title: 'Book IV (55 BC)', content: 'First crossing of the Rhine and first expedition to Britain.' },
                    { title: 'Book V (54 BC)', content: 'Second expedition to Britain and uprisings in Gaul.' },
                    { title: 'Book VI (53 BC)', content: 'Second crossing of the Rhine, customs of the Gauls, punitive expedition against the Eburones.' },
                    { title: 'Book VII (52 BC)', content: 'The great uprising of Vercingetorix, Siege of Alesia.' },
                    { title: 'Book VIII (51/50 BC)', content: 'Conclusion of the campaigns (written by Aulus Hirtius).' }
                ]
            },
            la: {
                title: 'Commentarii de Bello Gallico',
                summary: 'Commentarii Caesaris de bello in Gallia gesto. Opus summum propagandae politicae et narrationis sobriae.',
                takeaway: 'Omnis Gallia est divisa in partes tres...',
                structure: [
                    { title: 'Liber I', content: 'Bellum Helvetium et bellum contra Ariovistum.' },
                    { title: 'Liber II', content: 'Subigendi tribus Belgicae.' },
                    { title: 'Liber III', content: 'Bella in Alpibus et ad Oceanum.' },
                    { title: 'Liber IV', content: 'Transitus Rheni et prima expeditio in Britanniam.' },
                    { title: 'Liber V', content: 'Secunda expeditio in Britanniam et tumultus Gallici.' },
                    { title: 'Liber VI', content: 'Secundus transitus Rheni et mores Gallorum.' },
                    { title: 'Liber VII', content: 'Tumultus Vercingetorigis et obsidio Alesiae.' },
                    { title: 'Liber VIII', content: 'Finis belli (ab Aulo Hirtio scriptus).' }
                ]
            }
        }
    },
    'de-bello-civili': {
        title: 'De Bello Civili',
        author: 'caesar',
        year: '49 – 48 v. Chr.',
        summary: 'Caesars Darstellung des Bürgerkriegs gegen Pompeius.',
        takeaway: 'Die Verteidigung seiner Würde (dignitas) als Rechtfertigung für den Krieg.',
        structure: [
            { title: 'Buch I', content: 'Ausbruch des Krieges, Caesars Vormarsch in Italien und Spanien.' },
            { title: 'Buch II', content: 'Belagerung von Massilia und Kämpfe in Afrika.' },
            { title: 'Buch III', content: 'Der Krieg in Griechenland, die Schlacht von Pharsalus und der Tod des Pompeius.' }
        ],
        translations: {
            de: {
                title: 'De Bello Civili (Der Bürgerkrieg)',
                summary: 'Caesars Darstellung des Bürgerkriegs gegen Pompeius und den Senat.',
                takeaway: 'Ein Dokument der Rechtfertigung: Caesar wollte keinen Krieg, wurde aber durch seine Feinde dazu gezwungen.',
                structure: [
                    { title: 'Buch I', content: 'Ausbruch des Krieges, Caesars Vormarsch in Italien und Spanien.' },
                    { title: 'Buch II', content: 'Belagerung von Massilia und Kämpfe in Afrika.' },
                    { title: 'Buch III', content: 'Der Krieg in Griechenland, die Schlacht von Pharsalus und der Tod des Pompeius.' }
                ]
            },
            en: {
                title: 'De Bello Civili (The Civil War)',
                summary: 'Caesar\'s account of the civil war against Pompey and the Senate.',
                takeaway: 'A document of justification: Caesar did not want war but was forced into it by his enemies.',
                structure: [
                    { title: 'Book I', content: 'Outbreak of war, Caesar\'s advance in Italy and Spain.' },
                    { title: 'Book II', content: 'Siege of Massilia and battles in Africa.' },
                    { title: 'Book III', content: 'The war in Greece, the Battle of Pharsalus, and the death of Pompey.' }
                ]
            },
            la: {
                title: 'Commentarii de Bello Civili',
                summary: 'Commentarii Caesaris de bello civili contra Pompeium.',
                takeaway: 'Defensio dignitatis suae ut causa belli.',
                structure: [
                    { title: 'Liber I', content: 'Initium belli, progressus Caesaris in Italia et Hispania.' },
                    { title: 'Liber II', content: 'Obsidio Massiliae et pugnae in Africa.' },
                    { title: 'Liber III', content: 'Bellum in Graecia, pugna Pharsalica et mors Pompeii.' }
                ]
            }
        }
    }
};