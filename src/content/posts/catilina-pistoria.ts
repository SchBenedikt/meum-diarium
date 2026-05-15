import { BlogPost } from '@/types/blog';

export const post: Partial<BlogPost> & { image?: string; historicalDate?: string; translations?: any } = {
  slug: 'catilina-pistoria',
  author: 'catilina',
  title: 'Das Ende bei Pistoria',
  diaryTitle: 'Mein letzter Tag',
  scientificTitle: 'Die Schlacht von Pistoria (62 v. Chr.) – Catilinas Untergang',
  excerpt: 'Es ist vorbei. Meine Männer sind erschöpft, hungrig, aber sie kämpfen. Sie kämpfen für eine Sache, an die sie glauben – für ein Rom, das es nicht mehr gibt. Heute werde ich sterben.',
  historicalDate: '-62',
  date: '2025-02-14',
  readingTime: 8,
  tags: ['catilina', 'pistoria', 'verschwörung', 'tod', 'republik', 'schuld'],
  image: '/images/catilina-hero.png',
  content: {
    diary: `Es ist kalt. Januar in Norditalien – der Frost kriecht in die Knochen, und der Wind von den Apenninen schneidet durch unsere Mäntel. Wir haben nichts mehr. Keine Verpflegung, keine Reserven, keine Hoffnung auf Verstärkung.

Cicero hat gesiegt. Nicht mit dem Schwert – er hat nie ein Schwert in der Hand gehalten. Er hat mit Worten gesiegt, mit Senatsbeschlüssen, mit Verrat. Fulvia hat uns verraten. Die Allobroger haben uns verraten. Meine eigenen Leute haben mich verraten.

Und doch: Was bleibt mir, wenn nicht der Kampf?

Ich habe meine Männer versammelt in dieser Nacht. Dreitausend. Nicht mehr. Alte Soldaten Sullas, verschuldete Bauern, verbitterte Adlige. Männer, die alles verloren haben – außer ihrem Mut.

Ich sprach zu ihnen: "Ihr seht mich hier, ohne Geld, ohne Verbündete, ohne Hoffnung auf Gnade. Aber ich biete euch, was ich habe: mein Leben. Wenn ihr bleiben wollt, kämpfen wir gemeinsam. Wenn ihr gehen wollt, ich halte euch nicht auf."

Keiner ging.

Heute, wenn die Sonne über den Hügeln von Pistoria aufgeht, werden wir kämpfen. Nicht für Sieg – dafür ist es zu spät. Sondern für das, woran wir glauben. Dass ein anderer Weg möglich gewesen wäre. Ein Rom nicht nur für die Reichen.

Ich werde vor meinen Männern fallen. Das ist mein Recht. Das ist meine Pflicht.

Sallust wird über mich schreiben, und er wird mich verstehen. Er weiß, was es heißt, arm zu sein in einer Welt der Reichen.`,
    scientific: `Die Schlacht von Pistoria (heute Pistoia in der Toskana) im Januar 62 v. Chr. war das Ende der Catilinarischen Verschwörung. Sie fand etwa 40 Kilometer nördlich von Florenz statt.

**Die militärische Lage**

Nach der Aufdeckung der Verschwörung durch Cicero im November 63 v. Chr. war Catilina aus Rom geflohen und hatte sich in Etrurien zu den Truppen des Gaius Manlius geschlagen. Der Senat erklärte ihn zum Staatsfeind (*hostis publicus*) und beauftragte den Konsul Gaius Antonius Hybrida mit der militärischen Niederschlagung.

Catilinas Truppen bestanden aus etwa 3.000 Mann – Veteranen Sullas, verschuldeten Bauern und verarmten Adligen. Sie waren schlecht ausgerüstet, hungernd und demoralisiert. Antonius führte drei Legionen ins Feld, darunter erfahrene Kerntruppen.

**Die Schlacht**

Antonius selbst führte das Kommando nicht persönlich – angeblich wegen einer Fußverletzung (möglicherweise eine Ausrede, da er mit Catilina sympathisiert haben soll). Stattdessen befehligte Marcus Petreius, ein erfahrener Legat, die römischen Truppen.

Catilina stellte seine Truppen in einer verzweifelten Verteidigungsstellung auf. Der Kampf war erbittert. Nach Sallusts Bericht kämpfte Catilina persönlich in den vordersten Reihen. Als er sah, dass alles verloren war, stürzte er sich ins dichteste Kampfgetümmel und fiel.

**Historische Bedeutung**

Die Schlacht von Pistoria beendete die letzte ernsthafte Bedrohung der Senatsherrschaft vor Caesar. Sie zeigte aber auch die tiefe soziale Krise der späten Republik: Catilinas Anhänger waren keine Verbrecher, sondern Opfer der wirtschaftlichen Verwerfungen, die Sullas Diktatur und das System der Großgrundbesitzer verursacht hatten.

Die Leichen Catilinas und seiner Männer blieben auf dem Schlachtfeld liegen. Sein Kopf wurde nach Rom gebracht – ein Triumph für Cicero, der jedoch nur wenige Jahre währte.`,
  },
  translations: {
    de: {
      diaryTitle: 'Mein letzter Tag',
      scientificTitle: 'Die Schlacht von Pistoria (62 v. Chr.) – Catilinas Untergang',
      excerpt: 'Es ist vorbei. Meine Männer sind erschöpft, aber sie kämpfen für ein Rom, das es nicht mehr gibt.',
    },
    en: {
      diaryTitle: 'My Last Day',
      scientificTitle: 'The Battle of Pistoria (62 BC) – Catiline\'s Fall',
      excerpt: 'It is over. My men are exhausted, but they fight for a Rome that no longer exists.',
    },
    la: {
      diaryTitle: 'Dies meus ultimus',
      scientificTitle: 'Proelium apud Pistoriam (anno LXII a. C. n.) – Interitus Catilinae',
      excerpt: 'Actum est. Milites mei fessi sunt, sed pro Roma pugnant quae iam non est.',
    },
  },
};

export default post;
