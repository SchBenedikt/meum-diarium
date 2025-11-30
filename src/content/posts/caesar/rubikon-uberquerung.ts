import { BlogPost } from '@/types/blog';

const post: BlogPost = {
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
  };

export default post;
