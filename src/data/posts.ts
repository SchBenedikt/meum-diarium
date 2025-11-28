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
  // --- Auto-generated posts from timeline events ---
  {
    id: '13',
    slug: 'geburt-ciceros',
    author: 'cicero',
    title: 'Geburt Ciceros',
    excerpt: 'Marcus Tullius Cicero wird in Arpinum geboren',
    historicalDate: '106 v. Chr.',
    historicalYear: -106,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Geburt', 'Cicero'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Ein neuer Anfang. Heute, im Jahr 106 v. Chr. vor unserer Zeitrechnung, wurde ich, Marcus Tullius Cicero, in Arpinum geboren. Die Welt erwartet meine Worte.`,
      scientific: `Die Geburt von Marcus Tullius Cicero im Jahr 106 v. Chr. in Arpinum markiert den Beginn eines Lebens, das die römische Republik und die lateinische Sprache nachhaltig prägen sollte.`
    }
  },
  {
    id: '14',
    slug: 'geburt-caesars',
    author: 'caesar',
    title: 'Geburt Caesars',
    excerpt: 'Gaius Iulius Caesar wird in Rom geboren',
    historicalDate: '100 v. Chr.',
    historicalYear: -100,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Geburt', 'Caesar'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Rom hat einen neuen Sohn. Im Jahr 100 v. Chr. wurde ich, Gaius Iulius Caesar, geboren. Das Schicksal ruft.`,
      scientific: `Gaius Iulius Caesar wurde im Juli des Jahres 100 v. Chr. in Rom geboren. Seine Geburt in die gens Iulia, eine der ältesten Patrizierfamilien Roms, legte den Grundstein für seine außergewöhnliche Laufbahn.`
    }
  },
  {
    id: '15',
    slug: 'geburt-des-augustus',
    author: 'augustus',
    title: 'Geburt des Augustus',
    excerpt: 'Als Gaius Octavius in Rom geboren',
    historicalDate: '63 v. Chr.',
    historicalYear: -63,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Geburt', 'Augustus'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Mein Leben begann bescheiden. Geboren als Gaius Octavius in Rom im Jahr 63 v. Chr., konnte niemand ahnen, welchen Weg die Götter für mich vorsehen würden.`,
      scientific: `Augustus wurde am 23. September 63 v. Chr. als Gaius Octavius in Rom geboren. Seine spätere Adoption durch seinen Großonkel Gaius Iulius Caesar sollte den Lauf der Geschichte verändern.`
    }
  },
  {
    id: '16',
    slug: 'geburt-senecas',
    author: 'seneca',
    title: 'Geburt Senecas',
    excerpt: 'Lucius Annaeus Seneca wird in Córdoba geboren',
    historicalDate: '4 v. Chr.',
    historicalYear: -4,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Geburt', 'Seneca'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `In der Ferne, in Hispania, begann meine Reise. Um das Jahr 4 v. Chr. wurde ich, Lucius Annaeus Seneca, in Córdoba geboren, um die Lehren der Stoa nach Rom zu tragen.`,
      scientific: `Lucius Annaeus Seneca, bekannt als Seneca der Jüngere, wurde um das Jahr 4 v. Chr. in Córdoba, Hispania, geboren. Er wurde zu einem der führenden Intellektuellen seiner Zeit.`
    }
  },
  {
    id: '17',
    slug: 'ciceros-erste-rede',
    author: 'cicero',
    title: 'Ciceros erste Rede',
    excerpt: 'Pro Quinctio – Ciceros erste erhaltene Rede',
    historicalDate: '81 v. Chr.',
    historicalYear: -81,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Rhetorik', 'Recht'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Heute habe ich zum ersten Mal meine Stimme für das Recht erhoben. Die Verteidigung von Publius Quinctius war eine Herausforderung, aber mein Plädoyer stand fest. Die Macht des Wortes ist eine Waffe, die ich zu führen lerne.`,
      scientific: `Ciceros Rede 'Pro Quinctio' aus dem Jahr 81 v. Chr. ist seine früheste erhaltene Gerichtsrede. Sie zeigt bereits das rhetorische Talent, das ihn zu Roms größtem Redner machen sollte.`
    }
  },
  {
    id: '18',
    slug: 'caesar-wird-gefangen',
    author: 'caesar',
    title: 'Caesar wird gefangen',
    excerpt: 'Von Piraten entführt und freigekauft',
    historicalDate: '75 v. Chr.',
    historicalYear: -75,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Abenteuer', 'Piraten'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Eine unerwartete Wendung auf meiner Reise. Piraten! Sie dachten, sie hätten einen einfachen Fang gemacht. Sie forderten 20 Talente, ich lachte und sagte ihnen, ich sei mindestens 50 wert. Während der Gefangenschaft schrieb ich Reden und Gedichte, die ich ihnen vortrug. Sie werden für ihre Frechheit bezahlen.`,
      scientific: `Auf seiner Reise nach Rhodos wurde der junge Caesar 75 v. Chr. von kilikischen Piraten gefangen genommen. Er behielt während seiner Gefangenschaft eine bemerkenswerte Haltung bei und ließ sich nach seiner Freilassung gegen ein Lösegeld von 50 Talenten umgehend an den Piraten kreuzigen.`
    }
  },
  {
    id: '19',
    slug: 'spartacus-aufstand',
    author: 'caesar',
    title: 'Spartacus-Aufstand',
    excerpt: 'Der größte Sklavenaufstand beginnt',
    historicalDate: '73 v. Chr.',
    historicalYear: -73,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Aufstand', 'Sklaven'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Unruhen im Süden. Ein Gladiator namens Spartacus hat eine Revolte angezettelt. Die Republik unterschätzt diese Gefahr. Ein Funke kann ein Feuer entfachen, das ganz Italien erfasst. Ich beobachte die Situation mit Argusaugen.`,
      scientific: `Der von Spartacus angeführte Sklavenaufstand (73–71 v. Chr.) war der größte und gefährlichste seiner Art in der römischen Geschichte. Er erschütterte die Republik in ihren Grundfesten und wurde erst nach Jahren unter enormem militärischen Aufwand niedergeschlagen.`
    }
  },
  {
    id: '20',
    slug: 'cicero-gegen-verres',
    author: 'cicero',
    title: 'Cicero gegen Verres',
    excerpt: 'Die berühmten Reden gegen Verres',
    historicalDate: '70 v. Chr.',
    historicalYear: -70,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Korruption', 'Recht'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Die Sache gegen Verres ist mehr als nur ein Prozess. Es ist ein Kampf für die Gerechtigkeit und die Ehre Roms. Die Beweise seiner Plünderungen in Sizilien sind erdrückend. Meine Reden werden ihn entlarven und das Volk wird die Wahrheit erfahren.`,
      scientific: `Die Anklagereden gegen Gaius Verres im Jahr 70 v. Chr. etablierten Cicero als führenden Anwalt Roms. Obwohl Verres nach der ersten Rede freiwillig ins Exil ging, veröffentlichte Cicero die gesamte Anklageschrift ('In Verrem'), um die grassierende Korruption der Senatsaristokratie aufzudecken.`
    }
  },
  {
    id: '21',
    slug: 'catilinarische-verschworung',
    author: 'cicero',
    title: 'Catilinarische Verschwörung',
    excerpt: 'Cicero deckt die Verschwörung auf und rettet die Republik',
    historicalDate: '63 v. Chr.',
    historicalYear: -63,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Verschwörung', 'Republik'],
    coverImage: '/images/post-catiline.jpg',
    content: {
      diary: `Rom stand am Abgrund. Catilina und seine Verschwörer planten, die Stadt in Brand zu stecken und die Macht an sich zu reißen. Als Konsul war es meine Pflicht, zu handeln. Mit meiner Rede 'Quo usque tandem...' habe ich ihn im Senat entlarvt. Die Republik ist vorerst gerettet.`,
      scientific: `Als Konsul im Jahr 63 v. Chr. deckte Cicero die Verschwörung des Lucius Sergius Catilina auf. Seine entschiedenen Maßnahmen, einschließlich der Hinrichtung der Verschwörer ohne ordentliches Verfahren, brachten ihm den Ehrentitel 'Pater Patriae' (Vater des Vaterlandes) ein, führten aber später zu seinem eigenen Exil.`
    }
  },
  {
    id: '22',
    slug: 'erstes-triumvirat',
    author: 'caesar',
    title: 'Erstes Triumvirat',
    excerpt: 'Caesar, Pompeius und Crassus bilden ein Bündnis',
    historicalDate: '60 v. Chr.',
    historicalYear: -60,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Politik', 'Bündnis'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Die Politik in Rom ist ein Minenfeld. Allein kommt man nicht voran. Mit Pompeius und Crassus habe ich eine Übereinkunft getroffen. Ein informelles Bündnis, um die verkrusteten Strukturen des Senats zu umgehen. Gemeinsam sind wir stärker. Dies ist der Weg zur Macht.`,
      scientific: `Das sogenannte Erste Triumvirat war ein informelles politisches Bündnis zwischen Gaius Iulius Caesar, Gnaeus Pompeius Magnus und Marcus Licinius Crassus um 60 v. Chr. Es war kein offizielles Gremium, sondern eine private Absprache, um gegenseitig ihre politischen Ziele gegen den Widerstand der Optimaten im Senat durchzusetzen.`
    }
  },
  {
    id: '23',
    slug: 'beginn-des-gallischen-krieges',
    author: 'caesar',
    title: 'Beginn des Gallischen Krieges',
    excerpt: 'Caesar beginnt die Eroberung Galliens',
    historicalDate: '58 v. Chr.',
    historicalYear: -58,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Krieg', 'Gallien'],
    coverImage: '/images/post-alesia.jpg',
    content: {
      diary: `Die Helvetier sind unruhig. Ihre Wanderung bedroht unsere Provinz. Ich habe die Brücke bei Genf abreißen lassen. Dies ist die Gelegenheit, auf die ich gewartet habe. Gallien ist ein reiches, aber zerstrittenes Land. Es ist an der Zeit, es unter die Herrschaft Roms zu bringen.`,
      scientific: `Im Jahr 58 v. Chr. nutzte Caesar die Migration der Helvetier als Vorwand, um in Gallien militärisch zu intervenieren. Dies markierte den Beginn des acht Jahre dauernden Gallischen Krieges, der mit der Unterwerfung ganz Galliens endete und Caesars Macht und Reichtum enorm vergrößerte.`
    }
  },
  {
    id: '24',
    slug: 'caesar-uberquert-den-rhein',
    author: 'caesar',
    title: 'Caesar überquert den Rhein',
    excerpt: 'Erste römische Rheinüberquerung',
    historicalDate: '55 v. Chr.',
    historicalYear: -55,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Militär', 'Ingenieurskunst'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Die Germanen denken, der Rhein schütze sie. Eine Fehleinschätzung. In nur zehn Tagen haben meine Legionäre eine Brücke über den mächtigen Fluss geschlagen. Eine Demonstration römischer Macht und Ingenieurskunst. Wir betreten germanischen Boden nicht als Eindringlinge, sondern als Herren.`,
      scientific: `Im Jahr 55 v. Chr. ließ Caesar eine Holzbrücke über den Rhein bauen, um germanische Stämme, die die Gallier unterstützten, abzuschrecken. Die Brücke, ein Meisterwerk der römischen Militärtechnik, wurde in nur zehn Tagen errichtet. Nach einer kurzen Machtdemonstration auf der anderen Rheinseite zog sich Caesar zurück und ließ die Brücke wieder abreißen.`
    }
  },
  {
    id: '25',
    slug: 'invasion-britanniens',
    author: 'caesar',
    title: 'Invasion Britanniens',
    excerpt: 'Caesar landet in Britannien',
    historicalDate: '54 v. Chr.',
    historicalYear: -54,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Entdeckung', 'Britannien'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Eine neue Welt am Rande der bekannten Karte. Heute haben wir den Ozean überquert und sind in Britannien gelandet. Die Einheimischen kämpfen wild, aber unsere Disziplin wird siegen. Dies ist mehr als eine Eroberung, es ist eine Erweiterung des römischen Horizonts.`,
      scientific: `Caesar unternahm zwei Expeditionen nach Britannien (55 und 54 v. Chr.). Obwohl sie keine dauerhafte Eroberung zur Folge hatten, waren sie aus römischer Sicht ein großer Prestigegewinn. Er war der erste Römer, der den Ärmelkanal überquerte und militärische Operationen auf der Insel durchführte, was in Rom für großes Aufsehen sorgte.`
    }
  },
  {
    id: '26',
    slug: 'schlacht-bei-alesia',
    author: 'caesar',
    title: 'Schlacht bei Alesia',
    excerpt: 'Vercingetorix kapituliert – Ende des gallischen Widerstands',
    historicalDate: '52 v. Chr.',
    historicalYear: -52,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Belagerung', 'Sieg'],
    coverImage: '/images/post-alesia.jpg',
    content: {
      diary: `Die Falle ist zugeschnappt. Vercingetorix und seine Hauptstreitmacht sind in Alesia eingeschlossen. Wir haben einen doppelten Belagerungsring errichtet - einen nach innen, einen nach außen. Die gallische Entsatzarmee ist riesig, aber sie wird an unseren Befestigungen zerschellen. Geduld und Disziplin werden uns den Sieg bringen.`,
      scientific: `Die Belagerung von Alesia im Jahr 52 v. Chr. war die entscheidende Schlacht des Gallischen Krieges. Caesars geniale Taktik, einen doppelten Belagerungsring zu bauen, ermöglichte es ihm, die eingeschlossenen Gallier unter Vercingetorix und eine zahlenmäßig weit überlegene gallische Entsatzarmee gleichzeitig zu besiegen. Vercingetorix' Kapitulation besiegelte das Schicksal Galliens.`
    }
  },
  {
    id: '27',
    slug: 'schlacht-bei-pharsalos',
    author: 'caesar',
    title: 'Schlacht bei Pharsalos',
    excerpt: 'Caesar besiegt Pompeius entscheidend',
    historicalDate: '48 v. Chr.',
    historicalYear: -48,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Bürgerkrieg', 'Pompeius'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Heute hat sich das Schicksal Roms entschieden. Pompeius' Armee war zahlenmäßig überlegen, doch meine Veteranen sind unbesiegbar. Mit einer versteckten vierten Reihe Infanterie habe ich seine Kavallerie zerschlagen. Der große Pompeius floh vom Schlachtfeld. Der Sieg ist mein.`,
      scientific: `Die Schlacht bei Pharsalos am 9. August 48 v. Chr. in Thessalien war die entscheidende Auseinandersetzung im Bürgerkrieg zwischen Caesar und Pompeius. Trotz numerischer Unterlegenheit errang Caesar aufgrund seiner überlegenen Taktik und der Erfahrung seiner Legionen einen vernichtenden Sieg. Pompeius floh nach Ägypten, wo er ermordet wurde.`
    }
  },
  {
    id: '28',
    slug: 'veni-vidi-vici',
    author: 'caesar',
    title: 'Veni, vidi, vici',
    excerpt: 'Caesars Sieg über Pharnakes II.',
    historicalDate: '47 v. Chr.',
    historicalYear: -47,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Sieg', 'Spruch'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Der Feldzug gegen Pharnakes war kurz und entscheidend. Fünf Tage, eine Schlacht. Meinem Bericht an den Senat habe ich nur drei Worte hinzugefügt: VENI, VIDI, VICI. Ich kam, sah und siegte. Das sagt alles.`,
      scientific: `Nach seinem schnellen Sieg über Pharnakes II. von Pontos in der Schlacht bei Zela im Jahr 47 v. Chr. soll Caesar den berühmten Satz "Veni, vidi, vici" an einen Freund in Rom geschrieben haben. Diese lakonische Siegesbotschaft unterstrich die Effizienz und Geschwindigkeit seiner Kriegsführung.`
    }
  },
  {
    id: '29',
    slug: 'schlacht-bei-munda',
    author: 'caesar',
    title: 'Schlacht bei Munda',
    excerpt: 'Caesars letzter militärischer Sieg',
    historicalDate: '45 v. Chr.',
    historicalYear: -45,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Bürgerkrieg', 'Sieg'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Dies war der härteste Kampf meines Lebens. Die Söhne des Pompeius kämpften verbissen. Einen Moment lang dachte ich, alles sei verloren. Ich musste selbst in vorderster Reihe kämpfen, um meine Männer anzuspornen. Am Ende haben wir gesiegt, aber der Preis war hoch. Der Bürgerkrieg ist nun endgültig vorbei.`,
      scientific: `Die Schlacht bei Munda am 17. März 45 v. Chr. in Südspanien war die letzte Schlacht in Caesars Bürgerkrieg. Caesar besiegte die Legionen der Söhne des Pompeius. Der Sieg beendete den Bürgerkrieg und ermöglichte Caesar die Rückkehr nach Rom, wo er seine Macht als Diktator festigte.`
    }
  },
  {
    id: '30',
    slug: 'tod-ciceros',
    author: 'cicero',
    title: 'Tod Ciceros',
    excerpt: 'Proskribiert und auf Befehl des Antonius getötet',
    historicalDate: '43 v. Chr.',
    historicalYear: -43,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Tod', 'Antonius'],
    coverImage: '/images/post-philippic.jpg',
    content: {
      diary: `[Posthum rekonstruiert] Meine Reden gegen Antonius waren mein Todesurteil. Ich habe es gewusst. Als die Häscher kamen, habe ich mein Schicksal akzeptiert. Ich habe für die Republik gelebt, und ich sterbe für sie. Möge Rom eines Tages wieder frei sein. O tempora, o mores!`,
      scientific: `Nach der Bildung des Zweiten Triumvirats wurde Cicero auf Betreiben von Marcus Antonius proskribiert. Er wurde am 7. Dezember 43 v. Chr. auf der Flucht gefasst und getötet. Sein Kopf und seine Hände wurden auf der Rednerbühne in Rom ausgestellt – eine grausame Warnung an alle Feinde des Antonius.`
    }
  },
  {
    id: '31',
    slug: 'schlacht-bei-philippi',
    author: 'augustus',
    title: 'Schlacht bei Philippi',
    excerpt: 'Octavian und Antonius besiegen die Caesarmörder',
    historicalDate: '42 v. Chr.',
    historicalYear: -42,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Rache', 'Bürgerkrieg'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Brutus und Cassius sind besiegt. Der Geist meines Vaters ist gerächt. Die Schlacht war hart, und Antonius hat den größeren Anteil am Sieg. Aber das Ergebnis zählt. Die Mörder Caesars haben ihre gerechte Strafe erhalten. Nun beginnt der Kampf um sein Erbe.`,
      scientific: `Die Schlacht bei Philippi im Oktober 42 v. Chr. war eine entscheidende Auseinandersetzung zwischen den Streitkräften des Zweiten Triumvirats (Octavian und Antonius) und den Caesarmördern (Brutus und Cassius). Der Sieg der Triumvirn festigte ihre Macht über Rom.`
    }
  },
  {
    id: '32',
    slug: 'beginn-des-prinzipats',
    author: 'augustus',
    title: 'Beginn des Prinzipats',
    excerpt: 'Octavian erhält den Titel Augustus',
    historicalDate: '27 v. Chr.',
    historicalYear: -27,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Prinzipat', 'Frieden'],
    coverImage: '/images/post-pax-romana.jpg',
    content: {
      diary: `Heute hat mir der Senat den Ehrentitel 'Augustus', der Erhabene, verliehen. Ich habe die Republik offiziell wiederhergestellt, aber die Macht liegt in meinen Händen. Ich bin der 'Princeps', der Erste Bürger. Dies ist ein neuer Weg für Rom. Kein Königtum, sondern eine Herrschaft, die auf Ansehen und Gesetz beruht.`,
      scientific: `Am 16. Januar 27 v. Chr. verlieh der Senat Octavian den neuen Ehrennamen Augustus. Dieses Datum markiert formal den Beginn des Prinzipats, der römischen Kaiserzeit. Augustus schuf eine neue Staatsordnung, die die Fassade der Republik aufrechterhielt, während die wahre Macht beim Princeps lag.`
    }
  },
  {
    id: '33',
    slug: 'ara-pacis',
    author: 'augustus',
    title: 'Ara Pacis',
    excerpt: 'Der Friedensaltar wird geweiht',
    historicalDate: '19 v. Chr.',
    historicalYear: -19,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Frieden', 'Kunst'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Der Senat hat die Weihung des 'Ara Pacis Augustae', des Altars des Augusteischen Friedens, beschlossen. Er soll ein Denkmal für den Frieden sein, den ich Rom nach Jahrzehnten des Bürgerkriegs gebracht habe. Möge er für immer an die Segnungen der Stabilität und des Wohlstands erinnern.`,
      scientific: `Der Ara Pacis Augustae ist ein Altar, der dem Frieden geweiht und zwischen 13 und 9 v. Chr. auf dem Marsfeld in Rom errichtet wurde. Er ist ein Meisterwerk der augusteischen Kunst und ein zentrales Propagandainstrument, das den von Augustus hergestellten Frieden (Pax Augusta) feiert.`
    }
  },
  {
    id: '34',
    slug: 'varusschlacht',
    author: 'augustus',
    title: 'Varusschlacht',
    excerpt: 'Vernichtende Niederlage der Römer in Germanien',
    historicalDate: '9 n. Chr.',
    historicalYear: 9,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Niederlage', 'Germanien'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Eine schreckliche Nachricht aus Germanien. Drei Legionen, vernichtet. Varus, tot. Ein Verrat durch Arminius, dem ich vertraute. Man sagt, ich schlage meinen Kopf gegen die Wand und rufe: 'Quintilius Varus, gib mir meine Legionen zurück!'. Germanien ist verloren.`,
      scientific: `Die Schlacht im Teutoburger Wald im Jahr 9 n. Chr. war eine vernichtende Niederlage der Römer gegen ein Bündnis germanischer Stämme unter Führung von Arminius. Drei römische Legionen unter Publius Quinctilius Varus wurden vollständig aufgerieben. Diese Niederlage beendete die römischen Expansionsbestrebungen östlich des Rheins.`
    }
  },
  {
    id: '35',
    slug: 'tod-des-augustus',
    author: 'augustus',
    title: 'Tod des Augustus',
    excerpt: 'Augustus stirbt in Nola',
    historicalDate: '14 n. Chr.',
    historicalYear: 14,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Tod', 'Vermächtnis'],
    coverImage: '/images/post-res-gestae.jpg',
    content: {
      diary: `[Posthum rekonstruiert] Meine Zeit ist gekommen. Ich habe die Rolle meines Lebens gut gespielt. "Acta est fabula, plaudite!" - Das Stück ist aus, applaudiert! Ich hinterlasse ein stabiles Reich. Tiberius wird mein Werk fortsetzen. Ich habe Rom als Stadt aus Ziegeln vorgefunden und hinterlasse sie aus Marmor.`,
      scientific: `Augustus starb am 19. August 14 n. Chr. in Nola. Seine Herrschaft dauerte über 40 Jahre und legte den Grundstein für die nächsten zwei Jahrhunderte des Römischen Reiches. Er wurde zum Gott erhoben und im Augustusmausoleum in Rom beigesetzt.`
    }
  },
  {
    id: '36',
    slug: 'senecas-verbannung',
    author: 'seneca',
    title: 'Senecas Verbannung',
    excerpt: 'Nach Korsika verbannt durch Claudius',
    historicalDate: '41 n. Chr.',
    historicalYear: 41,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Exil', 'Philosophie'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Rom hat mich verstoßen. Auf dieser rauen Insel Korsika habe ich nur noch meine Gedanken. Aber ist nicht der Weise autark? Ist nicht das innere Exil schlimmer als das äußere? Ich werde diese Zeit nutzen, um zu schreiben und zu reflektieren. Die Philosophie ist mein einziges Vaterland.`,
      scientific: `Im Jahr 41 n. Chr. wurde Seneca auf Betreiben von Messalina, der Frau des Kaisers Claudius, der Mittäterschaft am Ehebruch mit Iulia Livilla, der Schwester Caligulas, beschuldigt und nach Korsika verbannt. Während seines achtjährigen Exils verfasste er mehrere philosophische Schriften, darunter 'De Consolatione ad Helviam'.`
    }
  },
  {
    id: '37',
    slug: 'ruckkehr-nach-rom',
    author: 'seneca',
    title: 'Rückkehr nach Rom',
    excerpt: 'Seneca wird aus der Verbannung zurückgerufen',
    historicalDate: '49 n. Chr.',
    historicalYear: 49,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Politik', 'Nero'],
    coverImage: '/images/post-nero.jpg',
    content: {
      diary: `Die Verbannung ist zu Ende. Agrippina, die neue Frau des Claudius, hat meine Rückkehr erwirkt. Ich soll Erzieher ihres Sohnes werden, des jungen Nero. Eine heikle Aufgabe. Kann ich einen zukünftigen Herrscher nach den Prinzipien der Stoa formen? Es ist eine Pflicht, die ich nicht ablehnen kann.`,
      scientific: `Auf Betreiben von Agrippina der Jüngeren wurde Seneca 49 n. Chr. aus der Verbannung zurückgerufen, um als Erzieher des jungen Nero zu fungieren. Nach Neros Thronbesteigung im Jahr 54 wurde Seneca zu einem seiner wichtigsten Berater und prägte die ersten, als positiv bewerteten Jahre von Neros Herrschaft.`
    }
  },
  {
    id: '38',
    slug: 'mord-an-agrippina',
    author: 'seneca',
    title: 'Mord an Agrippina',
    excerpt: 'Nero lässt seine Mutter töten',
    historicalDate: '59 n. Chr.',
    historicalYear: 59,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Nero', 'Verbrechen'],
    coverImage: '/images/post-nero.jpg',
    content: {
      diary: `Eine dunkle Stunde für Rom. Der Kaiser hat seine eigene Mutter ermorden lassen. Ich musste eine Rede verfassen, die diese ungeheuerliche Tat vor dem Senat rechtfertigt. Ein schmutziges Geschäft. Der Abgrund, der sich vor Nero auftut, zieht uns alle mit sich.`,
      scientific: `Im Jahr 59 n. Chr. ließ Nero seine Mutter Agrippina die Jüngere ermorden, die er als Bedrohung für seine Macht ansah. Seneca wurde gezwungen, die Tat nachträglich zu rechtfertigen, was seinen eigenen moralischen Kompromiss und seinen schwindenden Einfluss auf den Kaiser offenbarte.`
    }
  },
  {
    id: '39',
    slug: 'senecas-ruckzug',
    author: 'seneca',
    title: 'Senecas Rückzug',
    excerpt: 'Seneca zieht sich aus der Politik zurück',
    historicalDate: '62 n. Chr.',
    historicalYear: 62,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Rückzug', 'Philosophie'],
    coverImage: '/images/post-lucilius.jpg',
    content: {
      diary: `Es ist genug. Ich kann und will nicht länger Teil dieses Wahnsinns sein. Ich habe Nero um die Erlaubnis gebeten, mich ins Privatleben zurückzuziehen. Er hat widerwillig zugestimmt. Endlich kann ich mich ganz der Philosophie widmen, meinen Briefen an Lucilius, meinen Studien. Das ist der einzige wahre Reichtum.`,
      scientific: `Nachdem sein Einfluss auf Nero stark abgenommen hatte, zog sich Seneca im Jahr 62 n. Chr. aus dem politischen Leben zurück. Er widmete seine letzten Lebensjahre dem Schreiben und der Philosophie und verfasste in dieser Zeit einige seiner bedeutendsten Werke, darunter die 'Epistulae morales ad Lucilium'.`
    }
  },
  {
    id: '40',
    slug: 'tod-senecas',
    author: 'seneca',
    title: 'Tod Senecas',
    excerpt: 'Erzwungener Selbstmord nach der Pisonischen Verschwörung',
    historicalDate: '65 n. Chr.',
    historicalYear: 65,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Tod', 'Stoa'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `[Posthum rekonstruiert] Der Bote des Kaisers ist eingetroffen. Das Urteil ist der Tod. Ich nehme ihn an wie einen alten Freund. Der Weise fürchtet den Tod nicht, denn er ist Teil der Natur. Ich öffne mir die Pulsadern und diskutiere mit meinen Freunden über die Unsterblichkeit der Seele. Ein passendes Ende für einen Philosophen.`,
      scientific: `Im Jahr 65 n. Chr. wurde Seneca der Beteiligung an der Pisonischen Verschwörung gegen Nero bezichtigt und zum Selbstmord gezwungen. Sein Tod, den Tacitus in seinen 'Annalen' ausführlich beschreibt, wurde als stoisches Ideal eines würdevollen und furchtlosen Sterbens inszeniert.`
    }
  },
  {
    id: '41',
    slug: 'de-legibus',
    author: 'cicero',
    title: 'De Legibus',
    excerpt: 'Ciceros Werk über die Gesetze',
    historicalDate: '51 v. Chr.',
    historicalYear: -51,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Recht', 'Philosophie'],
    coverImage: '/images/post-republica.jpg',
    content: {
      diary: `Nach dem Staat ('De Re Publica') müssen die Gesetze ('De Legibus') folgen. Ein gerechter Staat braucht gerechte Gesetze, die im Naturrecht und in der göttlichen Vernunft gründen. Ich versuche, die Prinzipien der griechischen Philosophie auf das römische Recht anzuwenden.`,
      scientific: `'De Legibus' ('Über die Gesetze') ist ein philosophischer Dialog von Cicero, der als Ergänzung zu 'De Re Publica' konzipiert wurde. Darin entwickelt er die Idee eines Naturrechts, das allem positiven Recht übergeordnet ist und auf der universellen Vernunft basiert.`
    }
  },
  {
    id: '42',
    slug: 'tusculanae-disputationes',
    author: 'cicero',
    title: 'Tusculanae Disputationes',
    excerpt: 'Philosophische Gespräche in Tusculum',
    historicalDate: '45 v. Chr.',
    historicalYear: -45,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Philosophie', 'Glück'],
    coverImage: '/images/post-republica.jpg',
    content: {
      diary: `Nach dem Tod meiner geliebten Tochter Tullia finde ich nur in der Philosophie Trost. In meinem Landhaus in Tusculum führe ich Gespräche über die großen Fragen des Lebens: Wie überwindet man Schmerz? Ist der Tod ein Übel? Ist Tugend allein ausreichend für ein glückliches Leben?`,
      scientific: `Die 'Tusculanae Disputationes' ('Gespräche in Tusculum') sind eine fünfbändige philosophische Schrift Ciceros, verfasst 45 v. Chr. Sie behandeln in Dialogform die Bedingungen für ein glückliches Leben und wie man mit Schmerz, Furcht und dem Tod umgeht. Das Werk ist ein zentraler Text zur Vermittlung griechischer Philosophie in Rom.`
    }
  },
  {
    id: '43',
    slug: 'de-officiis',
    author: 'cicero',
    title: 'De Officiis',
    excerpt: 'Ciceros Werk über die Pflichten',
    historicalDate: '44 v. Chr.',
    historicalYear: -44,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Ethik', 'Philosophie'],
    coverImage: '/images/post-republica.jpg',
    content: {
      diary: `In diesen unsicheren Zeiten nach Caesars Tod schreibe ich für meinen Sohn Marcus über die Pflichten. Was ist ehrenhaft? Was ist nützlich? Und was, wenn beides im Konflikt steht? Es ist mein philosophisches Testament, ein Leitfaden für ein moralisch richtiges Leben als römischer Bürger.`,
      scientific: `'De Officiis' ('Über die Pflichten') ist Ciceros letztes großes philosophisches Werk, verfasst 44 v. Chr. als Brief an seinen Sohn. Es behandelt die praktische Ethik und den vermeintlichen Konflikt zwischen moralisch Richtigem (honestum) und Nützlichem (utile). Es war eines der einflussreichsten philosophischen Werke in der westlichen Geschichte.`
    }
  },
  {
    id: '44',
    slug: 'de-clementia',
    author: 'seneca',
    title: 'De Clementia',
    excerpt: 'Senecas Werk über die Milde für Nero',
    historicalDate: '55 n. Chr.',
    historicalYear: 55,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Politik', 'Philosophie'],
    coverImage: '/images/post-nero.jpg',
    content: {
      diary: `Ich habe für den jungen Kaiser eine Schrift über die Milde ('De Clementia') verfasst. Ein Herrscher gewinnt mehr durch Vergebung als durch Grausamkeit. Milde ist das wahre Zeichen von Stärke, nicht von Schwäche. Ich hoffe, er nimmt sich meine Worte zu Herzen.`,
      scientific: `Die Schrift 'De Clementia' ('Über die Milde') verfasste Seneca in den ersten Jahren von Neros Herrschaft (ca. 55/56 n. Chr.). Sie ist als Fürstenspiegel konzipiert und sollte den jungen Kaiser zu einer milden und gerechten Regierung anleiten, die auf der Zustimmung der Untertanen beruht.`
    }
  }
];
