# Content Wizard (Python)

Ein minimalistischer CLI‑Assistent zum Erstellen neuer Beiträge für Meum Diarium.

## Features
- Interaktive Abfrage aller Metadaten (Autor, Titel, Datum, Jahr, Tags, Cover)
- Mehrzeilige Eingabe für Inhalte (diary/scientific) in DE, optional EN/LA
- Automatische Slug‑Erzeugung (oder manuell), automatische ID‑Vergabe
- Abschätzung der Lesezeit auf Basis Wortanzahl
- Erzeugt eine TypeScript‑Datei unter `src/content/posts/<author>/<slug>.ts`
- Keine externe Python‑Library nötig

## Nutzung
```bash
python3 tools/content_wizard.py
```

Optionen:
- `--author cicero|caesar|augustus|seneca`
- `--title "Titel DE"`
- `--slug mein-slug`
- `--date YYYY-MM-DD`
- `--cover /images/post-default.jpg`

Während der Eingabe:
- Mehrzeilige Felder beenden Sie mit einer einzelnen Punkt-Zeile `.`
- EN/LA‑Übersetzungen sind optional. Deutsch ist immer die Basis und muss nicht in `translations.de` dupliziert werden.

## Hinweis zu Übersetzungen
Die App verwendet Deutsch als Basisinhalt. Für Deutsch ist daher keine `translations.de` notwendig. Übersetzungen für EN/LA können Sie optional hinzufügen; fehlen diese, greift die App auf die deutschen Basisinhalte zurück.