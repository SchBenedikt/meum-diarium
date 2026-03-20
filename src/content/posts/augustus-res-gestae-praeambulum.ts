import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'augustus-res-gestae-praeambulum',
  author: 'augustus',
  title: 'Res Gestae – Meine Taten für das Vaterland',
  diaryTitle: 'Was ich für Rom getan habe',
  scientificTitle: 'Res Gestae Divi Augusti – Einleitung und Bedeutung',
  excerpt: 'Ich habe das Testament meines Wirkens in Bronze gießen lassen. Die Nachwelt soll wissen, was ich für Rome getan habe – nicht als Herrschaft, sondern als Dienst.',
  historicalDate: '14',
  date: '2024-08-19',
  readingTime: 8,
  tags: ['res gestae', 'autobiography', 'prinzipat', 'vermächtnis', 'rom'],
  image: '/images/augustus-hero.png',
  content: {
    diary: `Ich bin siebzig Jahre alt und spüre, dass mein Ende naht. Nola ist angenehm im Sommer, aber die Hitze erschöpft mich mehr als früher. Livia ist bei mir. Das ist gut.

Was bleibt? Was habe ich hinterlassen?

Ich habe beschlossen, dass meine Taten für das Vaterland aufgezeichnet und in Bronze gegossen werden sollen. Nicht aus Eitelkeit – obwohl die Nachwelt mir das nicht glauben wird. Sondern weil es wichtig ist, dass die Wahrheit über meine Herrschaft festgehalten wird, bevor andere sie verdrehen.

Ich habe zweimal die Flotte aufgebaut. Ich habe die Straßen gebaut. Ich habe die Legionen reformiert. Ich habe die Grenzen gesichert. Ich habe Rom aus Ziegeln in eine Stadt aus Marmor verwandelt. Ich habe die Pax gegeben, nach Jahrzehnten des Blutes.

War es Herrschaft? Nein – ich war der erste Bürger, nichts weiter. Die Republik bestand fort, in neuem Gewand.

Die Götter werden urteilen. Ich tue, was ich kann, mein Andenken zu sichern.`,
    scientific: `Die Res Gestae Divi Augusti ("Die Taten des göttlichen Augustus") sind der bedeutendste autobiographische Text der Antike und eines der wichtigsten Zeugnisse augusteischer Selbstdarstellung und Propaganda.

**Entstehung und Überlieferung**

Der Text wurde kurz vor Augustus' Tod (14 n. Chr.) verfasst. Er ließ ihn in Bronze gießen und an seinem Mausoleum in Rom anbringen. Der Originaltext ist verloren, erhalten jedoch in drei griechischen Übersetzungen und einer lateinischen Kopie, die 1555 in Ankara (Ancyra, daher auch "Monumentum Ancyranum" genannt) gefunden wurde.

**Inhalt und Struktur**

Die Res Gestae gliedern sich in vier Hauptteile:
1. **Ehrenämter und politische Karriere** (Kapitel 1–14)
2. **Militärische Leistungen** (Kapitel 15–24)
3. **Finanzielle Aufwendungen für das Volk** (Kapitel 15–24)
4. **Außenpolitische Erfolge** (Kapitel 25–35)

**Bedeutung als historische Quelle**

Die Res Gestae sind primär eine Propagandaschrift. Augustus stellt sich darin konsequent als Diener der Republik dar, nicht als Herrscher. Tatsächliche Machtverhältnisse werden verschleiert; die Errungenschaften werden maximiert, Misserfolge (Varus-Niederlage 9 n. Chr.) verschwiegen.`,
  },
  translations: {
    de: {
      diaryTitle: 'Was ich für Rom getan habe',
      scientificTitle: 'Res Gestae Divi Augusti – Einleitung und Bedeutung',
      excerpt: 'Ich habe das Testament meines Wirkens in Bronze gießen lassen.',
    },
    en: {
      diaryTitle: 'What I Have Done for Rome',
      scientificTitle: 'Res Gestae Divi Augusti – Introduction and Significance',
      excerpt: 'I have had the testament of my actions cast in bronze. Posterity shall know what I did for Rome.',
    },
    la: {
      diaryTitle: 'Res Gestae pro Patria',
      scientificTitle: 'Res Gestae Divi Augusti – Prooemium et Auctoritas',
      excerpt: 'Res gestae meas in aere incidi et ante mausoleum meum posui.',
    },
  },
};

export default post;
