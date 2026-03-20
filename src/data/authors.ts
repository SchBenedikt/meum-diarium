// Fallback author data – used when D1 database is unavailable or missing entries.
// The useAuthors hook merges DB data (higher priority) with these defaults.
import { AuthorInfo } from "@/types/blog";

export const authors: Record<string, AuthorInfo> = {
  caesar: {
    id: 'caesar',
    name: 'Gaius Julius Caesar',
    latinName: 'C. Iulius Caesar',
    title: 'Dictator perpetuo',
    years: '100–44 v. Chr.',
    birthYear: -100,
    deathYear: -44,
    description:
      'Feldherr, Staatsmann und Schriftsteller. Caesars Feldzüge in Gallien, sein Bürgerkrieg gegen Pompeius und seine Diktatur veränderten die römische Republik für immer.',
    heroImage: '/images/caesar-hero.jpg',
    theme: 'caesar',
    color: '#B91C1C',
    highlights: [
      {
        title: 'De Bello Gallico',
        description: 'Caesars Kommentare zum Gallischen Krieg – ein Meisterwerk militärischer Literatur.',
        link: '/caesar/works/de-bello-gallico',
        icon: 'Scroll',
      },
      {
        title: 'Gallischer Krieg',
        description: '8 Jahre Feldzüge von 58–50 v. Chr. – Gallien wird römische Provinz.',
        link: '/caesar',
        icon: 'Sword',
      },
    ],
    translations: {
      en: {
        title: 'Dictator perpetuo',
        description:
          'General, statesman and writer. Caesar\'s campaigns in Gaul, his civil war against Pompey and his dictatorship transformed the Roman Republic forever.',
      },
      la: {
        title: 'Dictator perpetuo',
        description: 'Imperator, rei publicae rector et scriptor. Caesaris bella Gallica, bellum civile et dictatura rem publicam Romanam mutaverunt.',
      },
    },
  },

  cicero: {
    id: 'cicero',
    name: 'Marcus Tullius Cicero',
    latinName: 'M. Tullius Cicero',
    title: 'Consul, Orator, Philosophus',
    years: '106–43 v. Chr.',
    birthYear: -106,
    deathYear: -43,
    description:
      'Roms größter Redner, Konsul des Jahres 63 v. Chr. und Verteidiger der Republik. Cicero prägte die lateinische Sprache und überlieferte griechische Philosophie für die Nachwelt.',
    heroImage: '/images/cicero-hero.png',
    theme: 'cicero',
    color: '#1D4ED8',
    highlights: [
      {
        title: 'Orationes in Catilinam',
        description: 'Vier Reden gegen Catilina – Höhepunkt römischer Rhetorik.',
        link: '/cicero/works/in-catilinam',
        icon: 'Users',
      },
      {
        title: 'Philippicae',
        description: '14 Reden gegen Marcus Antonius, die ihm das Leben kosteten.',
        link: '/cicero/works/philippicae',
        icon: 'Award',
      },
    ],
    translations: {
      en: {
        title: 'Consul, Orator, Philosopher',
        description:
          'Rome\'s greatest orator, consul of 63 BC and defender of the Republic. Cicero shaped the Latin language and transmitted Greek philosophy to posterity.',
      },
      la: {
        title: 'Consul, Orator, Philosophus',
        description: 'Maximus orator Romanus, consul anni LXIII a. C. n. et defensor rei publicae.',
      },
    },
  },

  augustus: {
    id: 'augustus',
    name: 'Gaius Octavius Augustus',
    latinName: 'C. Octavius Augustus',
    title: 'Princeps, Erster Kaiser Roms',
    years: '63 v. Chr. – 14 n. Chr.',
    birthYear: -63,
    deathYear: 14,
    description:
      'Großneffe und Adoptivsohn Caesars. Begründer des Römischen Kaiserreichs (Prinzipat), der nach Jahrzehnten des Bürgerkriegs die Pax Romana einleitete und Rom in Marmor verwandelte.',
    heroImage: '/images/augustus-hero.jpg',
    theme: 'augustus',
    color: '#B45309',
    highlights: [
      {
        title: 'Res Gestae Divi Augusti',
        description: 'Autobiographischer Rechenschaftsbericht – das bedeutendste lateinische Inschriftenwerk.',
        link: '/augustus/works/res-gestae',
        icon: 'Scroll',
      },
      {
        title: 'Pax Romana',
        description: '200 Jahre relativen Friedens im Imperium Romanum, eingeleitet durch Augustus.',
        link: '/augustus',
        icon: 'Crown',
      },
    ],
    translations: {
      en: {
        title: 'Princeps, First Emperor of Rome',
        description:
          'Great-nephew and adopted son of Caesar. Founder of the Roman Empire (Principate), who ushered in the Pax Romana after decades of civil war and turned Rome into marble.',
      },
      la: {
        title: 'Princeps, Imperator Romanus Primus',
        description: 'Nepos magnus et filius adoptivus Caesaris. Conditor Principatus Romani et auctor Pacis Romanae.',
      },
    },
  },

  seneca: {
    id: 'seneca',
    name: 'Lucius Annaeus Seneca',
    latinName: 'L. Annaeus Seneca',
    title: 'Stoischer Philosoph und Staatsmann',
    years: '~4 v. Chr. – 65 n. Chr.',
    birthYear: -4,
    deathYear: 65,
    description:
      'Einer der bedeutendsten stoischen Philosophen der Antike, Berater Kaiser Neros und Verfasser zahlreicher philosophischer Schriften, Tragödien und Briefe, die bis heute Gültigkeit haben.',
    heroImage: '/images/seneca-hero.jpg',
    theme: 'seneca',
    color: '#065F46',
    highlights: [
      {
        title: 'Epistulae Morales',
        description: '124 Briefe an Lucilius – die tiefgründigste Sammlung stoischer Lebensweisheit.',
        link: '/seneca',
        icon: 'BookOpen',
      },
      {
        title: 'De Brevitate Vitae',
        description: 'Über die Kürze des Lebens – ein zeitloser Essay über Zeit und Sinn.',
        link: '/seneca',
        icon: 'Clock',
      },
    ],
    translations: {
      en: {
        title: 'Stoic Philosopher and Statesman',
        description:
          'One of the most important Stoic philosophers of antiquity, advisor to Emperor Nero and author of numerous philosophical works, tragedies and letters that remain relevant today.',
      },
      la: {
        title: 'Philosophus Stoicus et Vir Publicus',
        description: 'Unus ex praecipuis philosophis Stoicis antiquitatis, consiliarius Neronis imperatoris.',
      },
    },
  },

  catilina: {
    id: 'catilina',
    name: 'Lucius Sergius Catilina',
    latinName: 'L. Sergius Catilina',
    title: 'Römischer Senator und Verschwörer',
    years: '108–62 v. Chr.',
    birthYear: -108,
    deathYear: -62,
    description:
      'Patrizier, gescheiterter Konsulatsbewerber und Anführer der berühmten Catilinarischen Verschwörung gegen die Römische Republik. Durch Ciceros Reden für immer in die Geschichte eingegangen.',
    heroImage: '/images/catilina-hero.jpg',
    theme: 'catilina',
    color: '#7C3AED',
    highlights: [
      {
        title: 'Catilinarische Verschwörung',
        description: '63 v. Chr. – Staatsstreichsversuch gegen die Republik, aufgedeckt von Cicero.',
        link: '/catilina',
        icon: 'AlertTriangle',
      },
      {
        title: 'In Catilinam',
        description: 'Ciceros vier Reden gegen Catilina sind die bedeutendsten Zeugnisse dieser Epoche.',
        link: '/cicero/works/in-catilinam',
        icon: 'Scroll',
      },
    ],
    translations: {
      en: {
        title: 'Roman Senator and Conspirator',
        description:
          'Patrician, failed consul candidate and leader of the famous Catilinarian Conspiracy against the Roman Republic. Immortalised in history through Cicero\'s orations.',
      },
      la: {
        title: 'Senator Romanus et Coniurator',
        description: 'Patricius, candidatus consularis repulsus et dux coniurationis Catilinariae contra rem publicam Romanam.',
      },
    },
  },
};
