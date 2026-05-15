import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'seneca-de-ira',
  author: 'seneca',
  title: 'De Ira',
  diaryTitle: 'Vom Zorn – und warum ich ihn kenne',
  scientificTitle: 'Senecas De Ira – Philosophie der Affektkontrolle',
  excerpt: 'Der Zorn ist die zerstörerischste aller Leidenschaften. Ich schreibe darüber, weil ich ihn kenne – in mir selbst, in Nero, in der Politik Roms. Wer den Zorn besiegt, besiegt sich selbst.',
  historicalDate: '55',
  date: '2025-03-10',
  readingTime: 9,
  tags: ['seneca', 'stoizismus', 'zorn', 'philosophie', 'affekte'],
  image: '/images/seneca-hero.png',
  content: {
    diary: `Heute hatte ich eine dieser Unterredungen mit Nero, die mich an den Rand der Verzweiflung treiben.

Er wollte ein Todesurteil unterschreiben – einen Senator, der ihn angeblich beleidigt hatte. Das Urteil war in einer Stunde Zorn gefällt worden. Ich bat um Aufschub. Nur eine Nacht. Er tobte, schrie, drohte. Aber ich blieb ruhig.

Am nächsten Morgen hatte er es vergessen. Der Mann lebt. Vorerst.

Das ist es, was ich in De Ira beschrieben habe: Der Zorn ist niemals gerecht. Er kommt und geht wie ein Sturm, aber was er zurücklässt, ist Zerstörung. Nero ist das lebende Beispiel.

Ich kenne den Zorn gut. Als ich aus dem Exil zurückkehrte, war ich voller Bitterkeit. Ich hasste Messalina, die mich verbannt hatte. Ich hasste die Höflinge, die mich vergessen hatten. Aber Hasse ich verbrauchte mich. Er änderte nichts.

Erst als ich lernte, den Zorn nicht zu unterdrücken, sondern zu verstehen, wurde ich frei.

Die Stoiker sagen: Der Zorn ist ein kurzer Wahnsinn. *Ira furor brevis est.* Er lässt uns die Dinge nicht sehen, wie sie sind, sondern wie wir sie fürchten. Er macht aus einer Beleidigung eine Katastrophe, aus einem Wort einen Dolch.

Ich lehre Nero, aber ich fürchte, er lernt nicht. Vielleicht ist es bereits zu spät. Aber ich schreibe für die, die noch lernen können. Für alle, die den Sturm in sich selbst besänftigen wollen.

Nichts ist edler als ein Mensch, der seinen Zorn besiegt hat.`,
    scientific: `De Ira (Über den Zorn) ist eines der umfangreichsten Werke Senecas und gilt als die bedeutendste erhaltene Abhandlung über den Zorn aus der Antike. Es entstand vermutlich zwischen 49 und 55 n. Chr., in der Zeit nach Senecas Rückkehr aus dem Exil.

**Gliederung des Werks**

De Ira umfasst drei Bücher:
1. **Buch I** – Theoretische Grundlegung: Was ist Zorn? Ist er natürlich oder unnatürlich? Lässt er sich vermeiden?
2. **Buch II** – Psychologie des Zorns: Wie entsteht Zorn? Welche Rolle spielen Wahrnehmung, Urteil und Impulskontrolle?
3. **Buch III** – Therapie des Zorns: Praktische Übungen zur Vermeidung und Bewältigung von Zorn.

**Senecas Definition des Zorns**

Seneca definiert Zorn als *"cupiditas painiae exigendae"* – das Verlangen, eine erlittene Kränkung zu vergelten. Anders als die Peripatetiker, die einen gemäßigten Zorn für nützlich hielten, lehnt Seneca jede Form von Zorn ab. Zorn sei niemals rational, niemals gerechtfertigt, niemals nützlich.

**Die politische Dimension**

De Ira ist nicht nur eine philosophische Abhandlung, sondern auch ein politisches Werk. Seneca zielt auf die zügellose Willkür der römischen Machthaber ab. Die Beschreibung des zornigen Tyrannen ist eine unverhohlene Kritik an Caligula und eine Warnung an Nero.

**Wirkungsgeschichte**

De Ira hat die abendländische Affektpsychologie nachhaltig beeinflusst. Senecas Unterscheidung zwischen erstem Impuls (*primus motus*) und willentlicher Zustimmung (*adsensio*) wurde von Augustinus und Thomas von Aquin aufgegriffen und in die christliche Lehre von der Sünde integriert.`,
  },
  translations: {
    de: {
      diaryTitle: 'Vom Zorn – und warum ich ihn kenne',
      scientificTitle: 'Senecas De Ira – Philosophie der Affektkontrolle',
      excerpt: 'Der Zorn ist die zerstörerischste aller Leidenschaften. Ich schreibe darüber, weil ich ihn kenne.',
    },
    en: {
      diaryTitle: 'On Anger – and Why I Know It',
      scientificTitle: 'Seneca\'s De Ira – Philosophy of Emotional Control',
      excerpt: 'Anger is the most destructive of all passions. I write about it because I know it.',
    },
    la: {
      diaryTitle: 'De Ira – et cur eam novi',
      scientificTitle: 'Senecae De Ira – Philosophia Affectionum Temperandarum',
      excerpt: 'Ira omnium affectuum est perniciosissima. De ea scribo quia eam novi.',
    },
  },
};

export default post;
