import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'cicero-de-officiis',
  author: 'cicero',
  title: 'De Officiis',
  diaryTitle: 'Mein Vermächtnis an meinen Sohn',
  scientificTitle: 'De Officiis – Ciceros Philosophie der Pflichten',
  excerpt: 'Ich schreibe dies für meinen Sohn Marcus, in den langen Nächten nach dem Tod Caesars. Die Republik wankt, und ich will ihm mitgeben, was ein guter Mensch und Bürger wissen muss: worin wahre Pflicht besteht.',
  historicalDate: '-44',
  date: '2025-05-15',
  readingTime: 10,
  tags: ['cicero', 'philosophie', 'pflicht', 'stoa', 'republik', 'de officiis'],
  image: '/images/cicero-hero.png',
  content: {
    diary: `Marcus, mein Sohn,

Du bist in Athen, um zu lernen, während ich hier in Rom sitze und zusehe, wie alles zerfällt. Caesar ist tot, aber die Republik ist es nicht weniger. Antonius sammelt die Truppen. Octavian, dieser blutjunge Erbe, spielt sein eigenes Spiel. Und ich, der alte Cicero, versuche noch immer, die Ordnung zu retten.

Ich schreibe dieses Werk für dich. Nicht als Rhetoriklehrer – darin bist du längst geschult. Sondern als Vater, der seinem Sohn den Kompass geben will, den er selbst brauchte.

De Officiis – Über die Pflichten. Panaetius hat darüber geschrieben, ein Grieche von der Stoa. Ich folge ihm, aber ich gehe weiter. Denn was nützt dieTheorie, wenn die Welt brennt?

Ich frage mich oft: Hätte ich anders handeln sollen? Hätte ich Caesars Freundschaft annehmen sollen, wie so viele andere? Er bot sie mir an. Ich lehnte ab. Vielleicht war das Stolz. Vielleicht war es Pflicht.

Die Pflicht, Marcus, ist kein Regelwerk. Sie ist ein inneres Wissen darum, was recht ist. Die Stoiker nennen es *oikeiosis* – die natürliche Hinwendung zum Guten. Ich nenne es das, was einen Menschen zum Menschen macht.

Ich weiß nicht, ob ich diese Zeit überleben werde. Antonius hasst mich. Er wird mich töten lassen, wenn er kann. Aber dieses Buch wird bleiben. Es wird meinen Sohn lehren, was ich ihm nicht mehr persönlich sagen kann.

Diene der Republik. Ehre die Gesetze. Und vergiss nie: Du bist ein Mensch – und nichts Menschliches soll dir fremd sein.`,
    scientific: `De Officiis (Über die Pflichten) ist Ciceros letztes philosophisches Werk, verfasst im Herbst 44 v. Chr. in einer Phase intensiver politischer Tätigkeit zwischen Caesars Ermordung (15. März 44 v. Chr.) und Ciceros eigenem Tod (7. Dezember 43 v. Chr.). Es ist an seinen gleichnamigen Sohn Marcus gerichtet, der in Athen studierte.

**Entstehungskontext**

Das Werk entstand in einer der turbulentesten Phasen der späten Republik. Caesar war ermordet, aber die Verschwörer um Brutus und Cassius hatten keinen Plan für die Neuordnung des Staates. Marcus Antonius und Octavian rangen um die Macht, und Cicero selbst kämpfte mit seinen Philippischen Reden gegen Antonius. In diesem Klima der Unsicherheit verfasste Cicero sein systematischstes ethisches Werk.

**Inhalt und Gliederung**

De Officiis besteht aus drei Büchern:
1. **Buch I** – Vom Ehrenhaften (*honestum*): Die vier Kardinaltugenden (Weisheit, Gerechtigkeit, Tapferkeit, Maßigung) und ihre Anwendung im öffentlichen Leben.
2. **Buch II** – Vom Nützlichen (*utile*): Praktische Lebensklugheit, Umgang mit Macht und Reichtum.
3. **Buch III** – Vom Konflikt zwischen Ehrenhaft und Nützlich: Die berühmte These, dass nichts nützlich sein kann, was nicht auch ehrenhaft ist.

**Philosophische Quellen**

Cicero stützt sich auf die stoische Pflichtenlehre des Panaetios von Rhodos (ca. 185–109 v. Chr.), modifiziert sie jedoch im Sinne der akademischen Skepsis und der römischen Tradition. Anders als die griechischen Stoiker betont Cicero die soziale und politische Dimension der Pflicht: Der Mensch ist nicht nur zur Selbstvervollkommnung verpflichtet, sondern vor allem zum Dienst an der Gemeinschaft.

**Nachwirkung**

De Officiis war eines der einflussreichsten Werke der Antike. Es wurde von Kirchenvätern (Ambrosius), Humanisten (Petrarca, Erasmus) und Aufklärem (Grotius, Kant) rezipiert. Thomas von Aquin zitiert es, und noch im 19. Jahrhundert war es Pflichtlektüre an englischen Universitäten.`,
  },
  translations: {
    de: {
      diaryTitle: 'Mein Vermächtnis an meinen Sohn',
      scientificTitle: 'De Officiis – Ciceros Philosophie der Pflichten',
      excerpt: 'Ich schreibe dies für meinen Sohn Marcus, in den langen Nächten nach dem Tod Caesars.',
    },
    en: {
      diaryTitle: 'My Legacy to My Son',
      scientificTitle: 'De Officiis – Cicero\'s Philosophy of Duties',
      excerpt: 'I write this for my son Marcus, in the long nights after Caesar\'s death.',
    },
    la: {
      diaryTitle: 'Legatum meum ad filium meum',
      scientificTitle: 'De Officiis – Philosophia Ciceronis de officiis',
      excerpt: 'Haec scribo Marco filio meo, post Caesaris mortem noctibus longis.',
    },
  },
};

export default post;
