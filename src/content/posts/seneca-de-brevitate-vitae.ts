import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'seneca-de-brevitate-vitae',
  author: 'seneca',
  title: 'De Brevitate Vitae – Über die Kürze des Lebens',
  diaryTitle: 'Über die Kürze des Lebens',
  scientificTitle: 'Senecas De Brevitate Vitae – Analyse und Bedeutung',
  excerpt: 'Das Leben ist nicht kurz. Wir machen es kurz. Wir verschwenden es mit Müßiggang, Beschäftigkeit und sinnlosem Streben nach Reichtum und Ruhm, statt die Zeit zu nutzen, die uns gegeben ist.',
  historicalDate: '49',
  date: '2024-01-15',
  readingTime: 9,
  tags: ['stoizismus', 'zeit', 'leben', 'philosophie', 'de brevitate vitae'],
  image: '/images/seneca-hero.jpg',
  content: {
    diary: `Es ist wieder Morgen. Das Licht fällt durch das Fenster meines Arbeitszimmers in Corduba – nein, ich bin in Rom, natürlich. Die Gewohnheit des Geistes täuscht mich, wenn ich an die Kindheit denke.

Heute habe ich Paulinus meine Gedanken über die Zeit aufgeschrieben. Er ist ein kluger Mann, aber wie alle Menschen um mich herum – besetzt von tausend Nichtigkeiten. Verwaltungsaufgaben, Besucher, Dinnereinladungen.

"Dum differtur vita transcurrit," schrieb ich ihm. Solange man aufschiebt, vergeht das Leben.

Das ist kein Klischee. Das ist das tiefste Problem der menschlichen Existenz. Wir glauben, dass uns noch Zeit bleibt. Wir leben, als wäre das Leben eine Ressource, die man aufsparen kann. Aber jede Stunde, die wir verschwenden, ist weg. Für immer.

Die Reichen verschwenden sie mit Geldverdienen. Die Ehrgeizigen mit Politik. Die Genussmenschen mit Banketten und Theater. Alle warten auf den Moment, wo das "richtige Leben" beginnt. Aber das Leben ist dieser Moment. Dieser hier. Jetzt.

Ich habe Korsika überlebt. Acht Jahre Verbannung. Dort lernte ich, was Zeit wirklich ist.`,
    scientific: `"De Brevitate Vitae" (Über die Kürze des Lebens) ist ein philosophischer Traktat Senecas, der zwischen 49 und 55 n. Chr. entstanden sein dürfte und an seinen Schwiegervater Pompeius Paulinus gerichtet ist.

**Hauptthesen**

Seneca argumentiert gegen die verbreitete Klage, das Leben sei zu kurz (vita brevis), und vertritt die Position, dass Menschen das Leben durch schlechte Zeitnutzung selbst verkürzen. Das Leben ist lang genug, wenn es richtig genutzt wird (*vita satis longa est, si scitur uti*).

Er unterscheidet drei Gruppen von Zeitvergeudung:
1. **Negotiosi** – diejenigen, die mit fremden Angelegenheiten beschäftigt sind
2. **Voluptuosi** – diejenigen, die dem Genuss leben
3. **Ambitiosi** – diejenigen, die nach Ruhm und Macht streben

**Stoische Grundlagen**

Die Argumentation basiert auf stoischer Zeitphilosophie: Vergangenheit und Zukunft sind nicht real vorhanden; nur der gegenwärtige Moment existiert. Der Weise nutzt die Zeit für Philosophie und Selbstverbesserung, die einzige Beschäftigung, die den Menschen wahrhaft befreit.

**Einfluss und Rezeption**

De Brevitate Vitae gehört zu den meistgelesenen philosophischen Essays der Antike und hat die westliche Literatur bis in die Gegenwart beeinflusst. Sein Einfluss ist bei Montaigne, Pascal, Kant und modernen Zeitmanagement-Ratgebern nachweisbar.`,
  },
  translations: {
    de: {
      diaryTitle: 'Über die Kürze des Lebens',
      scientificTitle: 'Senecas De Brevitate Vitae – Analyse und Bedeutung',
      excerpt: 'Das Leben ist nicht kurz. Wir machen es kurz.',
    },
    en: {
      diaryTitle: 'On the Shortness of Life',
      scientificTitle: "Seneca's De Brevitate Vitae – Analysis and Significance",
      excerpt: 'Life is not short. We make it short. We waste it with idleness and meaningless striving.',
      content: {
        diary: `It is morning again. The light falls through the window of my study.

Today I wrote to Paulinus my thoughts on time. He is a clever man, but like all people around me – occupied by a thousand trivialities. Administrative tasks, visitors, dinner invitations.

"Dum differtur vita transcurrit," I wrote to him. While we delay, life passes by.

This is no cliché. This is the deepest problem of human existence. We believe there is still time left. We live as if life were a resource that can be saved up. But every hour we waste is gone. Forever.

The wealthy waste it making money. The ambitious waste it in politics. The pleasure-seekers waste it at banquets and theatres. Everyone waits for the moment when "real life" begins. But life is this moment. This one. Now.

I survived Corsica. Eight years of exile. There I learned what time truly is.`,
        scientific: `"De Brevitate Vitae" (On the Shortness of Life) is a philosophical treatise by Seneca, probably written between 49 and 55 AD, addressed to his father-in-law Pompeius Paulinus.`,
      },
    },
    la: {
      diaryTitle: 'De Brevitate Vitae',
      scientificTitle: 'Senecae De Brevitate Vitae – Expositio et Auctoritas',
      excerpt: 'Vita non est brevis; nos eam brevem facimus.',
    },
  },
};

export default post;
