import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'augustus-actium-victory',
  author: 'augustus',
  title: 'Der Sieg bei Actium',
  diaryTitle: 'Mein Triumph bei Actium',
  scientificTitle: 'Die Seeschlacht bei Actium (31 v. Chr.)',
  excerpt: 'Am 2. September 31 v. Chr. entschied ich die Seeschlacht bei Actium gegen Marcus Antonius und Kleopatra. Das Schicksal des Imperiums lag an diesem Tag in meinen Händen.',
  historicalDate: '-31',
  date: '2024-09-02',
  readingTime: 7,
  tags: ['actium', 'bürgerkrieg', 'antonius', 'kleopatra', 'seeschlacht'],
  image: '/images/augustus-hero.jpg',
  content: {
    diary: `Das Meer vor Actium spiegelt heute die aufgehende Sonne, als wären die Götter selbst Zeuge meines Triumphs. Marcus Agrippa, mein treuster Feldherr, hat alles gegeben – seine Schiffe, seine Strategie, sein Genie.

Antonius und Kleopatra flohen. Mit ihren eigenen Schiffen! Ich hatte erwartet, dass er kämpft, bis zum letzten Mann. Stattdessen: Flucht. Vielleicht war es Kleopatras Einfluss. Vielleicht erkannte er, dass alles verloren war.

Octavia, meine Schwester, hatte er verstoßen. Die drei Kinder hatte er mit der Ägypterin gezeugt. Sein Testament, das er im Vestalinnen-Tempel aufbewahren ließ und das ich öffnete: Er wollte in Alexandria begraben werden. Nicht in Rom. Das sagte alles.

Heute ist Rom frei. Die Republik... nein, ich will nicht lügen, auch nicht in meinem eigenen Tagebuch. Die Republik ist dies nicht mehr. Aber das, was ich an ihrer Stelle errichten werde, wird dauerhafter sein, gerechter, frieden-voller. Das schulde ich meinem Vater Caesar. Das schulde ich Rom.

Die Götter haben gesprochen. Ich bin ihr Werkzeug.`,
    scientific: `Die Seeschlacht bei Actium am 2. September 31 v. Chr. gilt als eine der entscheidendsten militärischen Auseinandersetzungen der antiken Geschichte. Sie beendete die letzte Phase der römischen Bürgerkriege und bereitete den Weg für die augusteische Alleinherrschaft.

**Vorgeschichte und strategische Lage**

Nach dem Tod Caesars 44 v. Chr. war das Römische Reich in eine Phase anhaltender politischer Instabilität getreten. Das Zweite Triumvirat (Octavian, Antonius, Lepidus, 43 v. Chr.) hatte die Macht vorläufig stabilisiert, zerbrach jedoch über die Rivalität zwischen Octavian und Marcus Antonius, der sich zunehmend mit der ptolemäischen Königin Kleopatra VII. verbündete.

**Verlauf der Seeschlacht**

Octavian, unterstützt von Agrippa als Flottenkommandant, blockierte Antonius' Flotte im Golf von Ambrakia. Die Schiffsflotten standen sich in etwa gleicher Stärke gegenüber: Antonius verfügte über ca. 500 Schiffe, Octavian über rund 400, darunter wendige Liburnen. Nach stundenlangem Kampf floh Kleopatra mit 60 Schiffen in Richtung Ägypten; Antonius folgte ihr.

**Historische Bedeutung**

Die Niederlage von Actium markiert den Endpunkt der spätrömischen Republik. Octavian konsolidierte seine Alleinherrschaft und begründete 27 v. Chr. das Prinzipat – eine neue Staatsform, die die Monarchie in republikanisches Gewand kleidete. Als Augustus regierte er bis zu seinem Tod 14 n. Chr.`,
  },
  translations: {
    de: {
      diaryTitle: 'Mein Triumph bei Actium',
      scientificTitle: 'Die Seeschlacht bei Actium (31 v. Chr.)',
      excerpt: 'Am 2. September 31 v. Chr. entschied ich die Seeschlacht bei Actium gegen Marcus Antonius und Kleopatra.',
    },
    en: {
      diaryTitle: 'My Triumph at Actium',
      scientificTitle: 'The Battle of Actium (31 BC)',
      excerpt: 'On September 2, 31 BC, I decided the naval battle of Actium against Marcus Antonius and Cleopatra.',
      content: {
        diary: `The sea before Actium reflects the rising sun today, as if the gods themselves witness my triumph. Marcus Agrippa, my most loyal general, gave everything – his ships, his strategy, his genius.

Antonius and Cleopatra fled. With their own ships! I had expected him to fight to the last man. Instead: flight. Perhaps it was Cleopatra's influence. Perhaps he recognized that all was lost.

Octavia, my sister, he had cast aside. The three children he had sired with the Egyptian woman. His will, which he had kept in the Temple of the Vestals and which I opened: he wanted to be buried in Alexandria. Not in Rome. That said everything.

Today Rome is free. The Republic... no, I will not lie, not even in my own diary. The Republic is no more. But what I will build in its place will be more lasting, more just, more peaceful. I owe that to my father Caesar. I owe that to Rome.

The gods have spoken. I am their instrument.`,
        scientific: `The Battle of Actium on September 2, 31 BC is considered one of the most decisive military engagements in ancient history. It ended the last phase of the Roman civil wars and paved the way for Augustan sole rule.`,
      },
    },
    la: {
      diaryTitle: 'Victoria mea ad Actium',
      scientificTitle: 'Proelium Navale ad Actium (anno XXXI a. C. n.)',
      excerpt: 'Die II Septembris anno XXXI a. C. n. proelium navale ad Actium contra M. Antonium et Cleopatram confeci.',
    },
  },
};

export default post;
