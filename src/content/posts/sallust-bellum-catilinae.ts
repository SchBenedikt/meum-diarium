import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'sallust-bellum-catilinae',
  author: 'sallust',
  title: 'Bellum Catilinae',
  diaryTitle: 'Warum ich die Geschichte Catilinas aufschreibe',
  scientificTitle: 'Sallusts Bellum Catilinae – Geschichtsschreibung als Moral',
  excerpt: 'Ich habe mich aus der Politik zurückgezogen. Nicht aus freiem Willen, sondern weil ich erkannt habe, dass ich in diesem Rom nicht mehr wirken kann. Also schreibe ich. Über das, was war. Und darüber, warum es so kommen musste.',
  historicalDate: '-40',
  date: '2025-05-10',
  readingTime: 9,
  tags: ['sallust', 'catilina', 'geschichte', 'republik', 'moral', 'historiographie'],
  image: '/images/sallust-hero.png',
  content: {
    diary: `Ich sitze in meinem Haus auf den Quirinal und blicke auf die Stadt, die ich einst mitregierte. Es ist seltsam, ein Historiker zu sein, wenn man selbst Teil der Geschichte war.

Ich war Volkstribun, ich war Prätor, ich war Statthalter von Africa Nova. Ich habe gesehen, wie die Republik zerfiel – von innen. Und ich habe gesehen, wie sie dabei half.

Als ich Caesars Partei wählte, tat ich es aus Überzeugung. Er war kein Heiliger, aber er war der Einzige, der verstand, dass Rom sich ändern musste. Die Oligarchen im Senat dachten nur an ihre Äcker, ihre Schuldner, ihre Pfründen. Caesar dachte an Rom.

Aber dann kam der Mord. Und dann kam Octavian. Und dann kam Antonius. Und am Ende: Dasselbe in neuem Gewand. Eine neue Alleinherrschaft, diesmal ohne Caesars Genie.

Ich schreibe über Catilina, weil seine Verschwörung der reinste Ausdruck dessen war, was mit Rom geschah. Ein verarmter Aristokrat, der das System nicht mehr ertrug – aber statt es zu reformieren, wollte er es niederbrennen. War er ein Verbrecher? Ja. Aber er war auch ein Symptom.

Die Krankheit Roms war die Habsucht – *avaritia*. Seit Sulla den Soldaten erlaubte, Beute zu machen, gab es keine Grenzen mehr. Jeder nahm, was er konnte. Der Staat war schwach, die Reichen unersättlich, die Armen verzweifelt.

Catilina war die logische Konsequenz.

Ich schreibe nicht, um zu unterhalten. Ich schreibe, um zu warnen. Denn wenn die Geschichte sich wiederholt – und sie tut es immer – wird es wieder einen Catilina geben.

Und vielleicht verdient er es dann, gehört zu werden.`,
    scientific: `Bellum Catilinae (Die Verschwörung Catilinas) ist das erste veröffentlichte Geschichtswerk des römischen Historikers Gaius Sallustius Crispus (86–35 v. Chr.). Es entstand vermutlich um 41 v. Chr., nach Sallusts Rückzug aus der Politik.

**Sallusts historiographischer Ansatz**

Sallust gehört zu den bedeutendsten römischen Geschichtsschreibern. Anders als seine Vorgänger versteht er Historiographie nicht als bloße Chronik, sondern als moralische Untersuchung. Sein Leitmotiv ist der Verfall der römischen Sitten (*corruptio morum*) seit dem Fall Karthagos (146 v. Chr.).

**Inhalt des Bellum Catilinae**

Das Werk gliedert sich in drei Teile:
1. **Einleitung** (Kapitel 1–5): Eine grundsätzliche Reflexion über den Niedergang Roms und die Notwendigkeit von Geschichtsschreibung.
2. **Hauptteil** (Kapitel 6–56): Die Darstellung der Verschwörung von 63 v. Chr., unterbrochen von berühmten Exkursen und Reden (Caesar, Cato).
3. **Schluss** (Kapitel 57–61): Die Schlacht von Pistoria und Catilinas Tod.

**Die Reden Caesars und Catos**

Ein literarisches Meisterstück ist die Gegenüberstellung der Reden Caesars und Catos des Jüngeren im Senat (Kapitel 51–52). Caesar plädiert für Milde, Cato für die Todesstrafe. Sallust lässt beide Argumente mit überzeugender Rhetorik vortragen – eine Technik, die Thukydides von ihm übernommen hat.

**Stilistische Besonderheiten**

Sallusts Stil ist archaisierend, knapp und pointiert. Er vermeidet die langen Perioden Ciceros und bevorzugt kurze, prägnante Sätze. Seine berühmteste Formulierung: *"Coniuravere pauci, sed boni, mali, omnes"* – "Verschworen haben sich wenige, aber Gute und Schlechte, alle."

**Nachwirkung**

Bellum Catilinae wurde in der römischen Kaiserzeit, im Humanismus und in der Neuzeit intensiv gelesen. Es beeinflusste Machiavelli, Montesquieu und Nietzsche. Seine Kritik an der politischen Korruption ist bis heute aktuell.`,
  },
  translations: {
    de: {
      diaryTitle: 'Warum ich die Geschichte Catilinas aufschreibe',
      scientificTitle: 'Sallusts Bellum Catilinae – Geschichtsschreibung als Moral',
      excerpt: 'Ich habe mich aus der Politik zurückgezogen, weil ich erkannt habe, dass ich in diesem Rom nicht mehr wirken kann.',
    },
    en: {
      diaryTitle: 'Why I Write the History of Catiline',
      scientificTitle: 'Sallust\'s Bellum Catilinae – Historiography as Morality',
      excerpt: 'I have withdrawn from politics because I realized I can no longer be effective in this Rome.',
    },
    la: {
      diaryTitle: 'Cur historiam Catilinae scribam',
      scientificTitle: 'Sallustii Bellum Catilinae – Historia ut Moralis Philosophia',
      excerpt: 'A re publica recessi, quod me in hac Roma nihil proficere posse cognovi.',
    },
  },
};

export default post;
