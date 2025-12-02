# Übersetzungs-Templates für alle Inhaltstypen

## 1. Timeline-Event Template

```typescript
import { TimelineEvent } from '@/types/blog';

const event: TimelineEvent = {
  year: -63,
  title: 'Catilinarische Verschwörung',
  description: 'Cicero deckt die Verschwörung auf und rettet die Republik',
  author: 'cicero',
  type: 'event',
  translations: {
    de: {
      title: 'Catilinarische Verschwörung',
      description: 'Cicero deckt die Verschwörung auf und rettet die Republik'
    },
    en: {
      title: 'Catiline Conspiracy',
      description: 'Cicero uncovers the conspiracy and saves the Republic'
    },
    la: {
      title: 'Coniuratio Catilinae',
      description: 'Cicero coniurationem detexit et rem publicam servavit'
    }
  }
};
```

## 2. Lexikon-Eintrag Template

```typescript
import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
  term: "Senat",
  slug: "senat",
  variants: ["Senatoren", "Senats"],
  definition: "Der Römische Senat war die wichtigste politische Institution der römischen Antike.",
  category: "Politik",
  etymology: "Von lat. 'senex' (alter Mann)",
  relatedTerms: ["konsul", "republik"],
  translations: {
    de: {
      term: "Senat",
      definition: "Der Römische Senat war die wichtigste politische Institution der römischen Antike.",
      category: "Politik",
      etymology: "Von lat. 'senex' (alter Mann)",
      variants: ["Senatoren", "Senats"]
    },
    en: {
      term: "Senate",
      definition: "The Roman Senate was the most important political institution of Roman antiquity.",
      category: "Politics",
      etymology: "From Latin 'senex' (old man)",
      variants: ["Senators", "Senate's"]
    },
    la: {
      term: "Senatus",
      definition: "Senatus Romanus institutio politica maxime significans antiquitatis Romanae fuit.",
      category: "Res Publica",
      etymology: "Ex 'senex' (vir senex)",
      variants: ["Senatores", "Senatus"]
    }
  }
};

export default entry;
```

## 3. Werk Template

```typescript
import { Work } from '@/types/blog';

const work: Work = {
  title: 'De Bello Gallico',
  author: 'caesar',
  year: 'ca. 58-49 v. Chr.',
  summary: 'Caesars berühmter Bericht über seine Feldzüge in Gallien.',
  takeaway: 'Römische Disziplin kann jede Barbarenarmee besiegen.',
  structure: [
    { 
      title: 'Buch 1', 
      content: 'Krieg gegen die Helvetier und Ariovist.' 
    },
    { 
      title: 'Buch 2', 
      content: 'Unterwerfung der belgischen Stämme.' 
    }
  ],
  translations: {
    de: {
      title: 'De Bello Gallico',
      summary: 'Caesars berühmter Bericht über seine Feldzüge in Gallien.',
      takeaway: 'Römische Disziplin kann jede Barbarenarmee besiegen.',
      structure: [
        { 
          title: 'Buch 1', 
          content: 'Krieg gegen die Helvetier und Ariovist.' 
        },
        { 
          title: 'Buch 2', 
          content: 'Unterwerfung der belgischen Stämme.' 
        }
      ]
    },
    en: {
      title: 'The Gallic Wars',
      summary: "Caesar's famous account of his campaigns in Gaul.",
      takeaway: 'Roman discipline can defeat any barbarian army.',
      structure: [
        { 
          title: 'Book 1', 
          content: 'War against the Helvetii and Ariovistus.' 
        },
        { 
          title: 'Book 2', 
          content: 'Subjugation of the Belgian tribes.' 
        }
      ]
    },
    la: {
      title: 'De Bello Gallico',
      summary: 'Commentarius Caesaris celeberrimus de expeditionibus suis in Gallia.',
      takeaway: 'Disciplina Romana quamlibet barbarorum aciem vincere potest.',
      structure: [
        { 
          title: 'Liber I', 
          content: 'Bellum contra Helvetios et Ariovistum.' 
        },
        { 
          title: 'Liber II', 
          content: 'Subactio tribuum Belgicarum.' 
        }
      ]
    }
  }
};

export default work;
```

## 4. Blog-Post Template (bereits dokumentiert)

Siehe `TRANSLATION_TEMPLATE.md` für vollständige Blog-Post Beispiele.

## 5. Übersetzungs-Tags für verschiedene Kategorien

### Politik-Begriffe (DE/EN/LA)
- Politik / Politics / Res Publica
- Recht / Law / Ius
- Macht / Power / Potestas
- Gesetz / Law / Lex
- Staat / State / Civitas

### Militär-Begriffe (DE/EN/LA)
- Militär / Military / Res Militaris
- Schlacht / Battle / Proelium
- Belagerung / Siege / Obsidio
- Sieg / Victory / Victoria
- Legion / Legion / Legio

### Philosophie-Begriffe (DE/EN/LA)
- Philosophie / Philosophy / Philosophia
- Weisheit / Wisdom / Sapientia
- Tugend / Virtue / Virtus
- Pflicht / Duty / Officium
- Vernunft / Reason / Ratio

### Ereignis-Typen (DE/EN/LA)
- Geburt / Birth / Natus
- Tod / Death / Mors
- Ereignis / Event / Eventus
- Werk / Work / Opus
- Rede / Speech / Oratio
- Verschwörung / Conspiracy / Coniuratio
- Bürgerkrieg / Civil War / Bellum Civile

## 6. Hilfsfunktion: Kategorien übersetzen

Füge diese zu `/src/locales/*.ts` hinzu:

```typescript
// Kategorien
category_politics: 'Politik',
category_law: 'Recht',
category_military: 'Militär',
category_philosophy: 'Philosophie',
category_society: 'Gesellschaft',
category_rhetoric: 'Rhetorik',
category_drama: 'Drama',
category_civilwar: 'Bürgerkrieg',

// Event-Typen
eventType_birth: 'Geburt',
eventType_death: 'Tod',
eventType_event: 'Ereignis',
eventType_work: 'Werk',

// Tags
tag_speech: 'Rede',
tag_conspiracy: 'Verschwörung',
tag_battle: 'Schlacht',
tag_siege: 'Belagerung',
tag_victory: 'Sieg',
```

## 7. Verwendung in Komponenten

### Timeline-Events übersetzen:
```typescript
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedTimeline } from '@/lib/translator';

const { language } = useLanguage();
const translatedEvents = await getTranslatedTimeline(language);
```

### Lexikon-Einträge übersetzen:
```typescript
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedLexicon } from '@/lib/translator';

const { language } = useLanguage();
const translatedLexicon = await getTranslatedLexicon(language);
```

### Werke übersetzen:
```typescript
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork } from '@/lib/translator';

const { language } = useLanguage();
const translatedWork = await getTranslatedWork(language, 'de-bello-gallico');
```

## 8. Prioritäten-Liste für Übersetzungen

### Hoch-Priorität (wichtig für Benutzererfahrung):
1. ✅ UI-Elemente (bereits übersetzt)
2. ✅ Autoren-Informationen (bereits übersetzt)
3. 🔲 Kategorien und Tags
4. 🔲 Event-Typen
5. 🔲 Häufigste Timeline-Events (Top 10)
6. 🔲 Wichtigste Lexikon-Einträge (Top 10)

### Mittel-Priorität:
7. 🔲 Alle Timeline-Events (~50 Events)
8. 🔲 Alle Lexikon-Einträge (~15 Einträge)
9. 🔲 Wichtigste Blog-Posts (~10 Posts)

### Niedrig-Priorität:
10. 🔲 Alle Werke (~10 Werke)
11. 🔲 Alle restlichen Blog-Posts (~20 Posts)
12. 🔲 Zitate und Sidebar-Inhalte

## 9. Schnell-Übersetzen Workflow

1. **Kopiere ein Template** von oben
2. **Füge deutsche Inhalte ein** (wenn noch nicht vorhanden)
3. **Übersetze ins Englische** (Google Translate als Basis, dann manuell verfeinern)
4. **Übersetze ins Lateinische** (wichtige Begriffe in klassischem Latein)
5. **Teste in der App** (Sprachwechsler verwenden)
6. **Commit & Push**

## 10. Automatisierungs-Hinweise

Für schnellere Übersetzung können KI-Tools helfen:
- DeepL für DE→EN
- Claude/ChatGPT für EN→LA (klassisches Latein)
- Manuelle Überprüfung für Genauigkeit

Die Templates sind so gestaltet, dass du nur die Strings kopieren und übersetzen musst!
