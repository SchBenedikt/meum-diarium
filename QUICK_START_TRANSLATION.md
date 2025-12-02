# 🚀 Quick-Start: Inhalte übersetzen

Du möchtest einen Inhalt übersetzen? Hier ist die schnellste Methode!

## 📝 Blog-Post übersetzen (3 Schritte)

### 1. Öffne die Post-Datei
```bash
# Beispiel:
src/content/posts/cicero/ciceros-erste-rede.ts
```

### 2. Füge am Ende vor `export default post;` hinzu:
```typescript
  translations: {
    de: {
      title: 'DEUTSCHER_TITEL',
      excerpt: 'DEUTSCHE_KURZBESCHREIBUNG',
      content: {
        diary: `DEUTSCHER_TAGEBUCH_TEXT`,
        scientific: `DEUTSCHER_WISSENSCHAFTLICHER_TEXT`
      },
      tags: ['Tag1', 'Tag2']
    },
    en: {
      title: 'ENGLISH_TITLE',
      excerpt: 'ENGLISH_SHORT_DESCRIPTION',
      content: {
        diary: `ENGLISH_DIARY_TEXT`,
        scientific: `ENGLISH_SCIENTIFIC_TEXT`
      },
      tags: ['Tag1', 'Tag2']
    },
    la: {
      title: 'TITULUS_LATINUS',
      excerpt: 'DESCRIPTIO_BREVIS_LATINA',
      content: {
        diary: `TEXTUS_DIARII_LATINUS`,
        scientific: `TEXTUS_SCIENTIFICUS_LATINUS`
      },
      tags: ['Tag1', 'Tag2']
    }
  }
```

### 3. Fertig! 🎉
Die Übersetzung wird automatisch angezeigt, wenn der Nutzer die Sprache wechselt.

---

## 📍 Timeline-Event übersetzen (2 Schritte)

### 1. Öffne die Timeline-Datei
```bash
src/data/timeline.ts
```

### 2. Füge beim Event hinzu:
```typescript
{ 
  year: -63, 
  title: 'DEUTSCHER_TITEL', 
  description: 'DEUTSCHE_BESCHREIBUNG',
  author: 'cicero',
  type: 'event',
  translations: {
    de: {
      title: 'DEUTSCHER_TITEL',
      description: 'DEUTSCHE_BESCHREIBUNG'
    },
    en: {
      title: 'ENGLISH_TITLE',
      description: 'ENGLISH_DESCRIPTION'
    },
    la: {
      title: 'TITULUS_LATINUS',
      description: 'DESCRIPTIO_LATINA'
    }
  }
}
```

---

## 📚 Lexikon-Eintrag übersetzen

### Öffne den Eintrag und füge hinzu:
```typescript
// In src/content/lexicon/[eintrag].ts

const entry: LexiconEntry = {
  term: "DEUTSCHER_BEGRIFF",
  slug: "slug",
  definition: "DEUTSCHE_DEFINITION",
  category: "Kategorie",
  // ... weitere Felder
  translations: {
    de: {
      term: "DEUTSCHER_BEGRIFF",
      definition: "DEUTSCHE_DEFINITION",
      category: "Kategorie"
    },
    en: {
      term: "ENGLISH_TERM",
      definition: "ENGLISH_DEFINITION",
      category: "Category"
    },
    la: {
      term: "TERMINUS_LATINUS",
      definition: "DEFINITIO_LATINA",
      category: "Categoria"
    }
  }
};
```

---

## 📖 Werk übersetzen

### Öffne das Werk und füge hinzu:
```typescript
// In src/content/works/[werk].ts

const work: Work = {
  title: 'TITEL',
  // ... weitere Felder
  translations: {
    de: {
      title: 'DEUTSCHER_TITEL',
      summary: 'DEUTSCHE_ZUSAMMENFASSUNG',
      takeaway: 'DEUTSCHE_QUINTESSENZ',
      structure: [
        { title: 'Kapitel 1', content: 'Inhalt...' }
      ]
    },
    en: {
      title: 'ENGLISH_TITLE',
      summary: 'ENGLISH_SUMMARY',
      takeaway: 'ENGLISH_TAKEAWAY',
      structure: [
        { title: 'Chapter 1', content: 'Content...' }
      ]
    },
    la: {
      title: 'TITULUS_LATINUS',
      summary: 'SUMMARIUM_LATINUM',
      takeaway: 'SENTENTIA_LATINA',
      structure: [
        { title: 'Liber I', content: 'Contentus...' }
      ]
    }
  }
};
```

---

## 💡 Tipps

### ✅ DOs:
- ✅ Kopiere die bestehenden deutschen Texte als Basis
- ✅ Nutze DeepL für EN-Übersetzungen (dann manuell verfeinern)
- ✅ Nutze Claude/ChatGPT für LA-Übersetzungen (klassisches Latein)
- ✅ Teste im Browser mit dem Sprachwechsler
- ✅ Du kannst nur DE übersetzen und EN/LA für später lassen

### ❌ DON'Ts:
- ❌ Vergiss nicht die Kommas zwischen den Objekten
- ❌ Vergiss nicht die schließenden Klammern `}`
- ❌ Übersetze keine Code-Begriffe (z.B. `slug`, `type`)
- ❌ Ändere nicht die Struktur (nur die Texte!)

---

## 🎯 Schnell-Checkliste

Beim Übersetzen eines Blog-Posts:
1. [ ] `title` übersetzt (DE/EN/LA)
2. [ ] `excerpt` übersetzt (DE/EN/LA)
3. [ ] `content.diary` übersetzt (DE/EN/LA)
4. [ ] `content.scientific` übersetzt (DE/EN/LA)
5. [ ] `tags` übersetzt (DE/EN/LA)
6. [ ] Kommas und Klammern geprüft
7. [ ] Im Browser getestet
8. [ ] Committed & Pushed

---

## 🆘 Hilfe bei Fehlern

### TypeScript-Fehler?
- Prüfe ob alle Klammern `{}` geschlossen sind
- Prüfe ob Kommas `,` zwischen Feldern stehen
- Prüfe ob Anführungszeichen `"` oder ``` ` ``` geschlossen sind

### Übersetzung wird nicht angezeigt?
- Prüfe ob `translations` im richtigen Objekt steht (vor `export default`)
- Prüfe ob die Sprach-Codes korrekt sind (`de`, `en`, `la`)
- Lösche den Browser-Cache und lade neu

---

## 📚 Mehr Details?

Für ausführliche Beispiele siehe:
- `TRANSLATION_TEMPLATE.md` - Blog-Post Details
- `CONTENT_TRANSLATION_TEMPLATES.md` - Alle Inhaltstypen
- `TRANSLATION_SYSTEM.md` - System-Übersicht

**Viel Erfolg beim Übersetzen! 🎊**
