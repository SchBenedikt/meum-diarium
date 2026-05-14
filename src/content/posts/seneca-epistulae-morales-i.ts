import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'seneca-epistulae-morales-i',
  author: 'seneca',
  title: 'Epistulae Morales I',
  diaryTitle: 'An Lucilius – Vindica te tibi',
  scientificTitle: 'Epistulae Morales I.1 – Philosophische Analyse',
  excerpt: 'Vindica te tibi – Nimm dir dich selbst zurück! Das ist mein erster Rat an Lucilius und an jeden, der diesen Brief liest. Unsere Zeit gehört uns. Niemand sonst.',
  historicalDate: '62',
  date: '2024-02-01',
  readingTime: 6,
  tags: ['epistulae morales', 'lucilius', 'stoizismus', 'zeit', 'freiheit'],
  image: '/images/seneca-hero.png',
  content: {
    diary: `Lucilius, mein Freund,

Du fragst mich, was ich in meiner Zurückgezogenheit treibe. Ich philosophiere. Ich lebe. Zum ersten Mal richtig.

Jahrelang war ich Berater, Erzieher, Staatsmann. Ich saß im Schatten Neros und versuchte, sein Schlechtestes zu mildern. Ich hatte Einfluss – aber keine Zeit. Keine Zeit für das Wesentliche.

Jetzt habe ich sie: die Zeit.

Und deshalb schreibe ich dir: Vindica te tibi. Nimm dir dich selbst zurück. Das ist das dringlichste Gebot des Lebens.

Beobachte, wie die Zeit vergeht. Heute nimmt sie die Gier in Anspruch, morgen die Lust, übermorgen der Ehrgeiz. Nie bleibt etwas für uns. Alles geht an andere.

Der Weise stiehlt sich Stunden zurück. Spart sie, wie man seltenes Gut spart. Und wenn er auf sein Leben zurückblickt, sieht er nicht: "Ich habe viel getan." Sondern: "Ich habe wirklich gelebt."

Das ist der Unterschied, Lucilius.

Leb wohl – und tu, was ich sage.

Dein Seneca`,
    scientific: `Die Epistulae Morales ad Lucilium (Briefe über Ethik an Lucilius) sind Senecas bedeutendstes Werk: 124 Briefe in 20 Büchern, zwischen 62 und 65 n. Chr. geschrieben.

**Brief I.1: Inhalt und Argumentation**

Der erste Brief stellt das Programm der gesamten Sammlung vor. Seneca fordert Lucilius auf: *Vindica te tibi* – "Nimm dir dich selbst zurück." Diese Formulierung ist programmatisch: Das Leben wird als Ressource betrachtet, die täglich durch Fremdansprüche geschmälert wird.

Senecas Argumentation:
1. Unsere Zeit wird ständig von anderen beansprucht (Gier, Lust, Ehrgeiz)
2. Wir verlieren Zeit durch Aufschieben (*dum differimus vivere*: "Während wir das Leben aufschieben")
3. Das einzig sinnvolle Gegenmittel: philosophische Lebensführung (*philosophia*)

**Briefgattung als philosophisches Medium**

Seneca wählt bewusst die Briefform als philosophisches Medium. Anders als der Dialog oder Traktat ermöglicht der Brief eine intimere, direktere Vermittlung stoischer Ethik. Die Fiktion einer realen Korrespondenz schafft Nähe.

**Lucilius als Adressat**

Lucilius Iunior war Prokonsul Siziliens und ein enger Freund Senecas. Ob die Briefe wirklich abgeschickt oder als literarische Fiktion konzipiert wurden, ist historisch umstritten. Wahrscheinlich sind sie eine Mischung aus echter Korrespondenz und literarischer Überarbeitung.`,
  },
  translations: {
    de: {
      diaryTitle: 'An Lucilius – Vindica te tibi',
      scientificTitle: 'Epistulae Morales I.1 – Philosophische Analyse',
      excerpt: 'Vindica te tibi – Nimm dir dich selbst zurück!',
    },
    en: {
      diaryTitle: 'To Lucilius – Vindica te tibi',
      scientificTitle: 'Epistulae Morales I.1 – Philosophical Analysis',
      excerpt: 'Vindica te tibi – Reclaim yourself! That is my first advice to Lucilius and to everyone who reads this letter.',
    },
    la: {
      diaryTitle: 'Ad Lucilium – Vindica te tibi',
      scientificTitle: 'Epistulae Morales I.1 – Analysis Philosophica',
      excerpt: 'Vindica te tibi – hoc primum philosophia promittit: sensum communem, humanitatem et congregationem.',
    },
  },
};

export default post;
