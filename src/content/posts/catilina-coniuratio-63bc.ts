import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'catilina-coniuratio-63bc',
  author: 'catilina',
  title: 'Die Verschwörung',
  diaryTitle: 'Was sie die Catilinarische Verschwörung nennen',
  scientificTitle: 'Die Catilinarische Verschwörung (63 v. Chr.) – Historische Analyse',
  excerpt: 'Sie nennen es Verrat. Ich nenne es Notwendigkeit. Rom ist krank – krank vor Schulden, vor Gier der Reichen, vor einer Aristokratie, die das Volk ausblutet. Ich wollte Wandel. Nicht Untergang.',
  historicalDate: '-63',
  date: '2024-10-27',
  readingTime: 10,
  tags: ['verschwörung', 'cicero', 'republik', 'krise', 'catilina', 'rom'],
  image: '/images/catilina-hero.png',
  content: {
    diary: `Sie haben mein Lager umzingelt. Die Truppen des Konsuls Antonius nähern sich. Ich weiß, dass dies mein Ende ist.

Was soll ich schreiben? Die Nachwelt wird Ciceros Version kennen – seine vier Reden gegen mich, sorgfältig poliert und für die Überlieferung vorbereitet. Meine Stimme wird schweigen.

Aber hier, in diesen letzten Stunden, schreibe ich die Wahrheit:

Ich war kein Monster. Ich war ein Mann, der sah, was Rom geworden war: eine Republik, in der die Schulden des Volkes die Freiheit der Väter auffraßen. In der Patrizier, die seit Generationen am Staatsgut saugten, jeden Reformversuch erstickten. Sulla hatte die Diktatur genutzt, um die Reichen zu bereichern. Caesar würde sie nutzen, um sich zu erheben. Ich wollte sie nutzen, um Rom zu befreien.

Ja, ich hatte Verbündete unter den Ruinierten, den Enteigneten, den Soldaten Sullas, die nach dreißig Jahren immer noch auf ihre versprochenen Ländereien warteten. War das Verbrechen?

Cicero hat gewonnen. Er hat mich zum Staatsfeind erklärt, meine Anhänger ohne Gerichtsverfahren hingerichtet. Das war illegal. Das wusste er. Aber er tat es trotzdem.

Die Geschichte wird ihn loben.`,
    scientific: `Die Catilinarische Verschwörung (63 v. Chr.) ist eines der bestdokumentierten politischen Ereignisse der spätrömischen Republik. Sie zeigt die systemischen Krisen einer Staatsordnung im Übergang zur Monarchie.

**Lucius Sergius Catilina – Biographie**

Catilina (ca. 108–62 v. Chr.) entstammte einem alten patrizischen Geschlecht, das seinen früheren Reichtum verloren hatte. Er bekleidete das Prätorenamt (68 v. Chr.) und war Statthalter in Afrika (67/66 v. Chr.), wo er wegen Amtsmissbrauchs angeklagt wurde. Zweimal bewarb er sich erfolglos um das Konsulat (64 und 63 v. Chr.).

**Die Verschwörung**

Nach seiner zweiten Wahlniederlage 63 v. Chr. begann Catilina mit der Organisation eines bewaffneten Aufstands. Ziele:
- Schuldenentlastung (tabulae novae – neue Schuldentafeln)
- Landumverteilung
- Ablösung der senatorischen Oligarchie

Die Verschwörung wurde durch Consul Cicero enthüllt, der sie durch Informanten (Fulvia) und die Briefe der gallischen Allobroger aufdeckte.

**Ciceros Rolle und rechtliche Problematik**

Cicero ließ fünf festgenommene Verschwörer nach einem Senatsbeschluss (senatus consultum ultimum) ohne Gerichtsverfahren hinrichten – eine Maßnahme, die rechtlich umstritten war und ihn später (58 v. Chr.) ins Exil trieb.

**Historische Bewertung**

Catilina wurde in der antiken Historiographie (Sallust, Cicero) meist als Demagoge und Krimineller dargestellt. Moderne Historiker betonen stärker die sozialen und ökonomischen Ursachen der Verschwörung: Sie war ein Symptom der tiefen strukturellen Krise der spätrömischen Republik.`,
  },
  translations: {
    de: {
      diaryTitle: 'Was sie die Catilinarische Verschwörung nennen',
      scientificTitle: 'Die Catilinarische Verschwörung (63 v. Chr.) – Historische Analyse',
      excerpt: 'Sie nennen es Verrat. Ich nenne es Notwendigkeit.',
    },
    en: {
      diaryTitle: 'What They Call the Catilinarian Conspiracy',
      scientificTitle: 'The Catilinarian Conspiracy (63 BC) – Historical Analysis',
      excerpt: 'They call it treason. I call it necessity. Rome was sick – sick with debt, with the greed of the rich, with an aristocracy bleeding the people dry.',
    },
    la: {
      diaryTitle: 'Quam Coniurationem Catilinariam vocant',
      scientificTitle: 'Coniuratio Catilinae (anno LXIII a. C. n.) – Analysis Historica',
      excerpt: 'Id proditionem vocant. Ego necessitatem voco.',
    },
  },
};

export default post;
