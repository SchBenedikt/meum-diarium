import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'augustus-varus-catastrophe',
  author: 'augustus',
  title: 'Die Varus-Katastrophe',
  diaryTitle: 'Varus, Varus, gib mir meine Legionen wieder',
  scientificTitle: 'Die Varus-Niederlage im Teutoburger Wald (9 n. Chr.)',
  excerpt: 'Drei Legionen. Vernichtet. In den Sümpfen und Wäldern Germaniens hat Arminius, den ich für einen Freund hielt, mir die Legionen Varus' vernichtet. Seitdem gehe ich nachts umher und starre gegen die Wand.',
  historicalDate: '9',
  date: '2025-04-20',
  readingTime: 9,
  tags: ['varus', 'germanien', 'niederlage', 'legionen', 'arminius', 'rom'],
  image: '/images/augustus-hero.png',
  content: {
    diary: `Ich kann nicht schlafen.

Seit Monaten nicht. Seit die Nachricht aus Germanien kam, ist es, als hätte ich einen Teil meiner selbst verloren. Drei Legionen. Die XVII., die XVIII., die XIX. – ausgelöscht. Fünfzehn- bis zwanzigtausend Männer, die besten Roms.

Varus. Warum habe ich ihm das Kommando gegeben? Er war ein Verwalter, kein Feldherr. Er kannte die Germanen nicht. Er verachtete sie. Er dachte, sie seien unterworfene Barbaren, die man wie Provinziale behandeln kann.

Und Arminius – dieser Cherusker, den ich zum Ritter gemacht hatte, dem ich vertraute. Er saß an meinem Tisch, lernte unsere Taktiken, trug unsere Uniform. Und dann führte er Varus in den Hinterhalt.

Septimus Severus sagte, der Himmel sei rot gewesen in jenen Tagen. Rotes Blut, schwarzer Sumpf, grüner Wald. Und dazwischen: Roms Stolz, verendet im Schlamm.

Ich habe die Haare nicht geschnitten seitdem. Ich lasse den Bart wachsen. Ich gehe durch die Hallen meines Palastes und schlage den Kopf gegen die Wände.

"Varus, Varus, gib mir meine Legionen wieder!"

Tiberius sagt, ich solle mich fassen. Livia bringt mir Essen, das ich nicht anrühre. Der Senat hat Trauer angeordnet, aber was nützt das?

Die Grenze ist verloren. Germanien ist verloren. Mein Traum von einem Reich bis zur Elbe – zerstört.

Die Götter strafen mich. Vielleicht für meinen Hochmut. Vielleicht, weil ich zu viel wollte.

Aber eines schwöre ich: Nie wieder werde ich einem Barbaren trauen. Nie wieder.`,
    scientific: `Die Varus-Niederlage (Clades Variana) im Jahr 9 n. Chr. gilt als eine der verheerendsten militärischen Katastrophen der römischen Geschichte und markiert den Wendepunkt der römischen Germanienpolitik.

**Vorgeschichte**

Seit den Feldzügen Drusus' (12–9 v. Chr.) und Tiberius' (8–7 v. Chr., 4–5 n. Chr.) hatte Rom Germanien zwischen Rhein und Elbe schrittweise unterworfen. Das Gebiet war als Provinz Germania Magna organisiert worden, mit Legionslagern, Verwaltungsstrukturen und einem Netz von Straßen und Kastellen. Publius Quinctilius Varus wurde 7 n. Chr. zum ersten Statthalter Germaniens ernannt.

**Der Verrat des Arminius**

Arminius (geb. ca. 18/17 v. Chr.), Sohn des Cheruskerfürsten Segimer, hatte als Führer germanischer Hilfstruppen im römischen Dienst das römische Bürgerrecht und den Ritterrang erworben. Er genoss das volle Vertrauen des Varus. Insgeheim organisierte er jedoch einen germanischen Aufstand.

**Die Schlacht**

Im Herbst 9 n. Chr. lockte Arminius Varus mit der Nachricht eines angeblichen Aufstands in ein vermeintlich abgelegenes Gebiet. Der römische Marschweg führte durch den Kalkrieser Bergpass bei Osnabrück – enges, sumpfiges Gelände, das für die schweren römischen Formationen ungeeignet war. Drei Legionen (XVII, XVIII, XIX), sechs Kohorten Hilfstruppen und drei Reitergeschwader wurden an mehreren aufeinanderfolgenden Tagen in Hinterhalte verwickelt und systematisch vernichtet. Varus nahm sich das Leben.

**Folgen**

Die Niederlage hatte tiefgreifende Konsequenzen: Augustus gab die Expansionspolitik jenseits des Rheins auf. Die neue Grenze verlief fortan entlang des Rheins und der Donau (Limes). Die Legionen XVII, XVIII und XIX wurden nie wieder aufgestellt – eine einmalige Ehre in der römischen Geschichte.`,
  },
  translations: {
    de: {
      diaryTitle: 'Varus, Varus, gib mir meine Legionen wieder',
      scientificTitle: 'Die Varus-Niederlage im Teutoburger Wald (9 n. Chr.)',
      excerpt: 'Drei Legionen. Vernichtet. Arminius, den ich für einen Freund hielt, hat mir die Legionen Varus' vernichtet.',
    },
    en: {
      diaryTitle: 'Varus, Varus, Give Me Back My Legions',
      scientificTitle: 'The Varus Defeat in the Teutoburg Forest (9 AD)',
      excerpt: 'Three legions. Annihilated. Arminius, whom I considered a friend, destroyed Varus\' legions.',
    },
    la: {
      diaryTitle: 'Vare, Vare, legiones meas redde!',
      scientificTitle: 'Clades Variana in Saltu Teutoburgiensi (anno IX p. C. n.)',
      excerpt: 'Tres legiones. Deletae. Arminius, quem amicum putabam, legiones Vari delevit.',
    },
  },
};

export default post;
