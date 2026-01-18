import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
    term: "Familia",
    slug: "familia",
    variants: [],
    definition: `## Die römische Hausgemeinschaft

Die **Familia** bezeichnete im römischen Recht die gesamte Hausgemeinschaft unter der Gewalt (*potestas*) des *paterfamilias*. Der Begriff umfasste weit mehr als die moderne Kernfamilie und bildete die Grundeinheit der römischen Gesellschaft.

### Zusammensetzung der Familia

Zur *familia* gehörten alle Personen und Güter unter der Herrschaft des Hausherrn:

**Personen (*personae*):**
- Der *paterfamilias* selbst (einziger rechtlich Unabhängiger)
- Ehefrau (*uxor* bzw. *matrona*)
- Kinder (*liberi*) jeden Alters
- Adoptierte Kinder
- Sklaven (*servi*)
- Freigelassene mit Verpflichtungen (*liberti*)
- Manchmal auch Klienten (*clientes*)

**Vermögen (*res*):**
- Das gesamte Familienvermögen (*patrimonium*)
- Haus und Grundbesitz
- Sklaven als lebendiges Eigentum
- Alles, was Familienmitglieder erwarben

### Rechtliche Bedeutung

Die *familia* war keine Personengemeinschaft im modernen Sinne, sondern eine **Herrschaftseinheit**:

- Nur der *paterfamilias* war *sui iuris* (rechtlich selbständig)
- Alle anderen waren *alieni iuris* (unter fremder Gewalt)
- Die *patria potestas* band alle an den Hausvater
- Beim Tod des *paterfamilias* entstanden mehrere neue *familiae*

> "Familia appellatio refertur ad servos" - Die Bezeichnung Familie bezieht sich ursprünglich auf die Sklaven (Ulpian)

### Arten der Familia

**Familia proprio iure**: Die Familie im engeren Sinne unter einem *paterfamilias*

**Familia communi iure**: Alle Personen, die unter einem gemeinsamen Vorfahren gestanden hätten (Gens, Sippe)

**Familia pecuniaque**: Familie und Vermögen als rechtliche Einheit

### Religiöse Dimension

Die *familia* war auch kultische Gemeinschaft:

- **Sacra familiaria**: Private Familienriten und Opfer
- **Lararium**: Hausaltar für Schutzgötter (*Lares*, *Penaten*)
- **Totenkult**: Verehrung der Ahnen (*manes*)
- **Genius**: Schutzgeist des *paterfamilias*

Die Fortsetzung des Familienkultes war entscheidend – daher die Bedeutung männlicher Nachkommen oder Adoption.

### Unterschied zu modernen Familienkonzepten

- Keine Gleichberechtigung der Mitglieder
- Einschluss von Unfreien (Sklaven)
- Rechtliche, nicht nur biologische Einheit
- Wirtschaftsgemeinschaft unter autokratischer Führung
- Religiöse Kultgemeinschaft`,
    category: "Gesellschaft",
    etymology: `Von *famulus* (Diener, Haussklave): Ursprünglich bezeichnete *familia* die Gesamtheit der Haussklaven. Später erweitert auf alle Personen unter der *patria potestas* des Hausherrn. Verwandt mit oskisch *faama* (Haus) und der indogermanischen Wurzel *dhē-* (setzen, stellen – die "Hausgemeinschaft").`,
    relatedTerms: [],
    translations: {
        "en": {
            "term": "Familia",
            "definition": "The 'familia' was the core social unit of Rome, but much broader than the modern nuclear family. It included the 'paterfamilias' (head of the household), his wife, children, other relatives living in the household, and slaves. The paterfamilias held absolute power ('patria potestas') over all members.",
            "etymology": "Latin 'familia' (household), from 'famulus' (servant/slave).",
            "category": "Society",
            "variants": ["Paterfamilias"]
        },
        "la": {
            "term": "Familia",
            "definition": "Familia Romana non solum parentes et liberos, sed etiam servos et omnes qui sub potestate patris familias erant, comprehendebat. Pater familias potestatem vitae necisque in suos habuit.",
            "etymology": "A verbo 'famulus'.",
            "category": "Societas",
            "variants": []
        }
    }
};

export default entry;
