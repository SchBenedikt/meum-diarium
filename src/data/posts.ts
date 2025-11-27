import { BlogPost } from '@/types/blog';

export const posts: BlogPost[] = [
  // CAESAR
  {
    id: '1',
    slug: 'rubikon-uberquerung',
    title: 'Die Überschreitung des Rubikon',
    latinTitle: 'Alea iacta est',
    excerpt: 'Der Moment, der die Geschichte Roms für immer veränderte.',
    date: '2024-01-15',
    historicalDate: '10. Januar 49 v. Chr.',
    historicalYear: -49,
    author: 'caesar',
    tags: ['Bürgerkrieg', 'Entscheidung'],
    readingTime: 8,
    coverImage: '/images/post-rubicon.jpg',
    content: {
      diary: `Salve, Leser meines Diariums!

Der heutige Tag wird in die Geschichte eingehen. Als ich am Ufer des Rubikon stand, wusste ich: Es gibt kein Zurück mehr.

**Der Senat hat mich verraten.** Zehn Jahre lang habe ich für Rom gekämpft, habe Gallien unterworfen. Und wie danken sie es mir? Mit Ultimaten!

Als ich den Befehl gab, den Fluss zu überqueren, sprach ich: **"Alea iacta est"** – Der Würfel ist gefallen.

Meine Soldaten folgten mir ohne zu zögern. Nun marschieren wir auf Rom.

*Vale et me ama,*
*Gaius Iulius Caesar*`,
      scientific: `## Die Überschreitung des Rubikon (49 v. Chr.)

### Historischer Kontext
Die Überschreitung des Rubikon am 10. Januar 49 v. Chr. markiert einen Wendepunkt der römischen Geschichte.

### Rechtliche Bedeutung
Nach römischem Recht war es einem Feldherrn verboten, mit bewaffneten Truppen diese Grenze zu überschreiten.

### Folgen
Die Rubikon-Überquerung löste den Bürgerkrieg aus, der zum Ende der Römischen Republik führte.

**Quellen:** Sueton, *Divus Iulius*; Plutarch, *Caesar*`,
    },
  },
  {
    id: '2',
    slug: 'alesia',
    title: 'Die Belagerung von Alesia',
    latinTitle: 'Obsidio Alesiae',
    excerpt: 'Vercingetorix und das letzte Aufbäumen der gallischen Freiheit.',
    date: '2024-01-20',
    historicalDate: 'September 52 v. Chr.',
    historicalYear: -52,
    author: 'caesar',
    tags: ['Gallischer Krieg', 'Belagerung'],
    readingTime: 10,
    coverImage: '/images/post-alesia.jpg',
    content: {
      diary: `Alesia ist gefallen. Vercingetorix hat sich mir ergeben.

**Aber am Ende siegte römische Ingenieurskunst.** Wir bauten 18 Kilometer Befestigungen um die Festung.

Als Vercingetorix seine Waffen zu meinen Füßen warf, sah ich das Ende eines Kapitels. Gallien gehört nun Rom.

*Veni, vidi, vici* – zumindest hier in Gallien.`,
      scientific: `## Die Belagerung von Alesia (52 v. Chr.)

Die Schlacht um Alesia gilt als militärisches Meisterwerk. Caesars doppelte Belagerungslinie (Circumvallation und Contravallation) verhinderte sowohl den Ausbruch als auch die Entsetzung.

**Truppenstärken:** Römer ca. 60.000, Gallier in Alesia ca. 80.000

**Quellen:** Caesar, *De Bello Gallico*, Buch VII`,
    },
  },
  {
    id: '3',
    slug: 'iden-des-maerz',
    title: 'Die Iden des März',
    latinTitle: 'Idus Martiae',
    excerpt: 'Et tu, Brute? Die letzten Stunden.',
    date: '2024-02-10',
    historicalDate: '15. März 44 v. Chr.',
    historicalYear: -44,
    author: 'caesar',
    tags: ['Attentat', 'Tod'],
    readingTime: 6,
    coverImage: '/images/post-ides-of-march.jpg',
    content: {
      diary: `*[Posthum rekonstruiert]*

Der Morgen begann wie jeder andere. Calpurnia flehte mich an, nicht in den Senat zu gehen. Sie hatte schlecht geträumt.

Als ich Brutus sah – meinen Brutus –, da wusste ich: Es ist vorbei.

**"Καὶ σύ, τέκνον?"** – Auch du, mein Kind?

*Acta est fabula.*`,
      scientific: `## Die Ermordung Caesars (44 v. Chr.)

Das Attentat fand am 15. März 44 v. Chr. in der Curia des Pompeius statt. 23 Dolchstiche führten zum Tod.

### Die Verschwörer
Etwa 60 Senatoren, angeführt von Marcus Brutus und Gaius Cassius.

**Quellen:** Sueton, Plutarch, Appian`,
    },
  },

  // CICERO
  {
    id: '4',
    slug: 'catilinarische-reden',
    title: 'Gegen Catilina',
    latinTitle: 'In Catilinam',
    excerpt: 'Wie lange noch, Catilina, wirst du unsere Geduld missbrauchen?',
    date: '2024-01-25',
    historicalDate: '8. November 63 v. Chr.',
    historicalYear: -63,
    author: 'cicero',
    tags: ['Rede', 'Verschwörung'],
    readingTime: 7,
    coverImage: '/images/post-catiline.jpg',
    content: {
      diary: `Heute war der Tag, an dem ich Rom gerettet habe.

**"Quo usque tandem abutere, Catilina, patientia nostra?"**

Ich sah, wie die Farbe aus seinem Gesicht wich. Er wusste nicht, wie viel ich wusste. Am Ende floh er aus Rom.

*In perpetuum,*
*Marcus Tullius Cicero, Consul*`,
      scientific: `## Die Catilinarischen Reden (63 v. Chr.)

Die vier Reden gegen Lucius Sergius Catilina gehören zu den berühmtesten der römischen Antike.

### Die vier Reden
1. **8. November** – Im Senat
2. **9. November** – Vor dem Volk
3. **3. Dezember** – Nach der Verhaftung
4. **5. Dezember** – Über das Urteil

**Quellen:** Cicero, *In Catilinam I-IV*; Sallust`,
    },
  },
  {
    id: '5',
    slug: 'de-republica',
    title: 'Über den Staat',
    latinTitle: 'De Re Publica',
    excerpt: 'Gedanken über die ideale Staatsform.',
    date: '2024-02-01',
    historicalDate: 'ca. 54-51 v. Chr.',
    historicalYear: -54,
    author: 'cicero',
    tags: ['Philosophie', 'Politik'],
    readingTime: 9,
    coverImage: '/images/post-republica.jpg',
    content: {
      diary: `Ein ruhiger Abend auf meinem Landgut in Tusculum.

Ich arbeite an **De Re Publica**. Inspiriert von Platon, aber römisch im Geist.

Was ist die beste Staatsform? Nur die Mischverfassung vereint die Vorzüge aller drei.

*Philosophia dux vitae,*
*Cicero*`,
      scientific: `## De Re Publica (54-51 v. Chr.)

Ein philosophischer Dialog in sechs Büchern über die beste Staatsform.

### Kernthese
Die gemischte Verfassung (Monarchie + Aristokratie + Demokratie) ist allen reinen Formen überlegen.

**Quellen:** Cicero, *De Re Publica*; Platon, *Politeia*`,
    },
  },
  {
    id: '6',
    slug: 'philippische-reden',
    title: 'Die Philippischen Reden',
    latinTitle: 'Orationes Philippicae',
    excerpt: 'Mein letzter Kampf gegen die Tyrannei.',
    date: '2024-02-15',
    historicalDate: '44-43 v. Chr.',
    historicalYear: -44,
    author: 'cicero',
    tags: ['Rede', 'Marcus Antonius'],
    readingTime: 8,
    coverImage: '/images/post-philippic.jpg',
    content: {
      diary: `Marcus Antonius ist nicht besser als Catilina. Er strebt nach der Alleinherrschaft!

Ich werde ihn bekämpfen, mit der einzigen Waffe die ich habe: Meine Worte.

Diese Reden werden mein Vermächtnis sein – oder mein Todesurteil.`,
      scientific: `## Die Philippischen Reden (44-43 v. Chr.)

14 Reden gegen Marcus Antonius nach der Ermordung Caesars.

### Folgen
Die Reden führten zu Ciceros Proskription und Tod am 7. Dezember 43 v. Chr.

**Quellen:** Cicero, *Philippicae*`,
    },
  },

  // AUGUSTUS
  {
    id: '7',
    slug: 'actium',
    title: 'Die Schlacht bei Actium',
    latinTitle: 'Proelium Actiacum',
    excerpt: 'Der Sieg, der mir die Welt gab.',
    date: '2024-02-20',
    historicalDate: '2. September 31 v. Chr.',
    historicalYear: -31,
    author: 'augustus',
    tags: ['Seeschlacht', 'Bürgerkrieg'],
    readingTime: 7,
    coverImage: '/images/post-actium.jpg',
    content: {
      diary: `Heute habe ich Antonius und Kleopatra besiegt. Die Seeschlacht war entscheidend.

Als ihre Schiffe flohen, wusste ich: Rom gehört mir. Aber ich werde kein Tyrann sein wie mein Adoptivvater.

Ich werde Rom in eine neue Ära führen – eine Ära des Friedens.`,
      scientific: `## Die Schlacht bei Actium (31 v. Chr.)

Die entscheidende Seeschlacht zwischen Octavian und der Flotte von Marcus Antonius und Kleopatra.

### Ergebnis
Octavians Sieg beendete den Bürgerkrieg und führte zur Alleinherrschaft.

**Quellen:** Cassius Dio; Plutarch, *Antonius*`,
    },
  },
  {
    id: '8',
    slug: 'res-gestae',
    title: 'Meine Taten',
    latinTitle: 'Res Gestae Divi Augusti',
    excerpt: 'Ein Rückblick auf mein Lebenswerk.',
    date: '2024-02-25',
    historicalDate: '14 n. Chr.',
    historicalYear: 14,
    author: 'augustus',
    tags: ['Autobiografie', 'Vermächtnis'],
    readingTime: 10,
    coverImage: '/images/post-res-gestae.jpg',
    content: {
      diary: `Im Alter von 19 Jahren habe ich eine Armee aufgestellt. Heute, nach über 50 Jahren, hinterlasse ich ein Reich in Frieden.

**Ich habe Rom aus Ziegeln gefunden und aus Marmor hinterlassen.**

Die Grenzen sind gesichert, die Bürgerkriege beendet. Das ist mein Vermächtnis.`,
      scientific: `## Res Gestae Divi Augusti

Ein Rechenschaftsbericht des Augustus, nach seinem Tod in Bronze eingraviert.

### Inhalt
- Militärische Erfolge
- Bauwerke und Geschenke an das Volk
- Politische Ämter und Ehrungen

**Quellen:** *Monumentum Ancyranum* (erhaltene Kopie in Ankara)`,
    },
  },
  {
    id: '9',
    slug: 'pax-romana',
    title: 'Der Augusteische Frieden',
    latinTitle: 'Pax Romana',
    excerpt: 'Zwei Jahrhunderte Frieden beginnen.',
    date: '2024-03-01',
    historicalDate: '27 v. Chr.',
    historicalYear: -27,
    author: 'augustus',
    tags: ['Frieden', 'Prinzipat'],
    readingTime: 6,
    coverImage: '/images/post-pax-romana.jpg',
    content: {
      diary: `Der Senat hat mir den Titel "Augustus" verliehen. Ich bin nun der Erste unter Gleichen – nicht mehr, nicht weniger.

Die Tore des Janus-Tempels sind geschlossen. Zum ersten Mal seit Generationen herrscht Frieden im gesamten Reich.`,
      scientific: `## Pax Romana (27 v. Chr. – 180 n. Chr.)

Eine etwa 200 Jahre währende Periode relativen Friedens im Römischen Reich.

### Merkmale
- Keine größeren Bürgerkriege
- Wirtschaftlicher Aufschwung
- Kulturelle Blüte

**Quellen:** Tacitus, *Annales*; Cassius Dio`,
    },
  },

  // SENECA
  {
    id: '10',
    slug: 'briefe-an-lucilius',
    title: 'Briefe an Lucilius',
    latinTitle: 'Epistulae Morales ad Lucilium',
    excerpt: 'Philosophische Weisheiten für das tägliche Leben.',
    date: '2024-03-05',
    historicalDate: '62-65 n. Chr.',
    historicalYear: 63,
    author: 'seneca',
    tags: ['Philosophie', 'Stoizismus'],
    readingTime: 8,
    coverImage: '/images/post-lucilius.jpg',
    content: {
      diary: `Mein lieber Lucilius,

Es ist nicht so, dass wir wenig Zeit hätten, sondern dass wir viel davon verschwenden. **Das Leben ist lang genug, wenn man es weise nutzt.**

Die meisten Menschen klagen über die Kürze des Lebens, während sie ihre Tage mit Nichtigkeiten vergeuden.

*Vale,*
*Seneca*`,
      scientific: `## Epistulae Morales ad Lucilium (62-65 n. Chr.)

124 erhaltene Briefe an Senecas Freund Lucilius.

### Themen
- Umgang mit der Zeit
- Tod und Vergänglichkeit
- Tugendhaftes Leben
- Freundschaft

**Quellen:** Seneca, *Epistulae Morales*`,
    },
  },
  {
    id: '11',
    slug: 'de-brevitate-vitae',
    title: 'Von der Kürze des Lebens',
    latinTitle: 'De Brevitate Vitae',
    excerpt: 'Das Leben ist lang – wenn man es zu leben versteht.',
    date: '2024-03-10',
    historicalDate: 'ca. 49 n. Chr.',
    historicalYear: 49,
    author: 'seneca',
    tags: ['Philosophie', 'Zeit'],
    readingTime: 7,
    coverImage: '/images/post-brevitate.jpg',
    content: {
      diary: `Die meisten Menschen leben, als hätten sie ewige Zeit. Dabei vergessen sie zu leben.

**Nicht die Jahre zählen, sondern was wir daraus machen.**

Sei kein Sklave der Zukunft und kein Gefangener der Vergangenheit. Lebe jetzt.`,
      scientific: `## De Brevitate Vitae (ca. 49 n. Chr.)

Eine philosophische Abhandlung über den richtigen Umgang mit der Lebenszeit.

### Kerngedanken
- Zeit ist das einzige wahrhaft Kostbare
- Die meisten Menschen verschwenden ihr Leben
- Philosophie als Weg zum erfüllten Leben

**Quellen:** Seneca, *De Brevitate Vitae*`,
    },
  },
  {
    id: '12',
    slug: 'neros-lehrer',
    title: 'Am Hofe Neros',
    latinTitle: 'In Aula Neronis',
    excerpt: 'Zwischen Philosophie und Politik.',
    date: '2024-03-15',
    historicalDate: '54-62 n. Chr.',
    historicalYear: 55,
    author: 'seneca',
    tags: ['Politik', 'Nero'],
    readingTime: 9,
    coverImage: '/images/post-nero.jpg',
    content: {
      diary: `Acht Jahre lang war ich Neros Berater. Die ersten fünf Jahre – das "Quinquennium Neronis" – waren gut. Der junge Kaiser hörte auf meinen Rat.

Doch dann änderte sich alles. Der Mord an seiner Mutter Agrippina war der Anfang vom Ende.

Ich habe mich zurückgezogen. Die Philosophie ist mein einziger Trost.`,
      scientific: `## Seneca als Berater Neros (54-62 n. Chr.)

### Das Quinquennium Neronis
Die ersten fünf Jahre von Neros Herrschaft gelten als vorbildlich.

### Senecas Rolle
- Erzieher seit Neros Jugend
- Politischer Berater
- Verfasser kaiserlicher Reden

**Quellen:** Tacitus, *Annales*; Cassius Dio`,
    },
  },
];
