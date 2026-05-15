import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'sokrates-apologie',
  author: 'sokrates',
  title: 'Die Verteidigung',
  diaryTitle: 'Meine Rede vor den Richtern',
  scientificTitle: 'Die Apologie des Sokrates (399 v. Chr.)',
  excerpt: 'Ich bin angeklagt, die Jugend zu verführen und an andere Götter zu glauben als die, an die Athen glaubt. Die Wahrheit ist: Ich stelle Fragen. Und das verzeiht mir niemand.',
  historicalDate: '-399',
  date: '2025-01-20',
  readingTime: 10,
  tags: ['sokrates', 'philosophie', 'prozess', 'athen', 'apologie', 'gerechtigkeit'],
  image: '/images/sokrates-hero.png',
  content: {
    diary: `Der Gerichtshof der Heliaia ist voll. Fünfhundert athenische Bürger sitzen zu Gericht, und das Volk drängt sich auf den Gängen. Ich kenne viele Gesichter – Freunde, Feinde, Neugierige.

Meletos, der mich angeklagt hat, steht rechts. Ein junger Mann mit glattem Gesicht und glattem Charakter. Er spricht von Gottlosigkeit und Verführung der Jugend. Aber das eigentliche Vergehen, das er mir nie nennt, ist ein anderes: Ich habe die Mächtigen Athens lächerlich gemacht.

Ich habe gefragt: "Was ist Gerechtigkeit?" und der Politiker wusste keine Antwort.
Ich habe gefragt: "Was ist Tapferkeit?" und der Feldherr stammelte.
Ich habe gefragt: "Was ist Weisheit?" und der Dichter wiederholte nur seine Verse.

Sie vergeben mir nicht, dass ich ihr Nichtwissen aufgedeckt habe. Das ist mein wahres Verbrechen.

Heute stehe ich vor ihnen. Ich könnte um Gnade bitten. Ich könnte meine Frau und meine Kinder herbringen lassen, um Mitleid zu erregen – das tun alle Angeklagten. Aber ich werde es nicht tun.

Denn ich habe Recht getan. Ich habe den Apollon verehrt, indem ich fragte. Ich habe die Jugend nicht verdorben – ich habe sie gelehrt, selbst zu denken.

Wenn sie mich verurteilen, werde ich gehen. Nicht im Zorn. Sondern mit der Ruhe eines Mannes, der weiß, dass kein Mensch einem Weisen schaden kann.

Platon, mein Schüler, wird mir zuhören und sich alles merken. Er wird meine Worte aufschreiben, damit die Nachwelt weiß, was an diesem Tag geschah.

Vielleicht ist dieser Prozess nicht mein Ende. Vielleicht ist er der Anfang von etwas, das größer ist als ich.`,
    scientific: `Die Apologie des Sokrates, überliefert von Platon, gehört zu den berühmtesten Gerichtsreden der Weltliteratur. Sie dokumentiert den Prozess gegen Sokrates im Jahr 399 v. Chr. in Athen.

**Die Anklage**

Die offizielle Anklageschrift des Meletos lautete: "Sokrates begeht Unrecht, indem er die Jugend verdirbt und die Götter, welche die Stadt verehrt, nicht verehrt, sondern andere, neue Gottheiten." Hinter der Anklage standen jedoch politische Motive: Sokrates' Schüler Kritias war einer der Dreißig Tyrannen gewesen (404 v. Chr.), und die wiederhergestellte Demokratie suchte nach Sündenböcken.

**Aufbau der Verteidigungsrede**

1. **Proömium** – Sokrates distanziert sich von den Rhetorikern; er werde schlicht und wahrhaftig sprechen.
2. **Widerlegung der alten Vorwürfe** – Sokrates erklärt seine Mission: Das Orakel von Delphi habe ihn als weisesten Mann bezeichnet, weil er wisse, dass er nicht wisse.
3. **Widerlegung der neuen Vorwürfe** – Kreuzverhör des Meletos, in dem Sokrates dessen Widersprüche aufdeckt.
4. **Die Gegenstrafe** – Sokrates schlägt spöttisch vor, im Prytaneion auf Staatskosten gespeist zu werden.
5. **Schlussrede nach der Verurteilung** – Prophezeiung, dass seine Richter sich rächen werde.

**Das Urteil**

Sokrates wurde mit 280 zu 220 Stimmen für schuldig befunden. Auf die Frage nach der Strafe schlug er zunächst eine Geldstrafe vor, dann – provoziert durch die Todesforderung der Ankläger – erklärte er, eher den Tod als das Schweigen zu wählen. Er wurde zum Tode durch den Schierlingsbecher verurteilt.

**Bedeutung**

Die Apologie ist nicht nur das Gründungsdokument der abendländischen Philosophie, sondern auch ein zeitloses Plädoyer für die Freiheit des Denkens und das Recht auf kritische Nachfrage.`,
  },
  translations: {
    de: {
      diaryTitle: 'Meine Rede vor den Richtern',
      scientificTitle: 'Die Apologie des Sokrates (399 v. Chr.)',
      excerpt: 'Ich bin angeklagt, die Jugend zu verführen und an andere Götter zu glauben.',
    },
    en: {
      diaryTitle: 'My Speech Before the Judges',
      scientificTitle: 'The Apology of Socrates (399 BC)',
      excerpt: 'I am accused of corrupting the youth and believing in other gods than those Athens believes in.',
    },
    la: {
      diaryTitle: 'Oratio mea apud iudices',
      scientificTitle: 'Apologia Socratis (anno CCCXCIX a. C. n.)',
      excerpt: 'Accusatus sum quod iuventutem corrumpam et alia numina colam quam quae Athena colit.',
    },
  },
};

export default post;
