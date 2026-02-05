# Latin Texts Structure

This directory contains JSON files with Latin original texts for the reader functionality.

## File Structure

Each JSON file represents a complete work and follows this structure:

```json
{
  "id": "work-slug",
  "title": "Work Title",
  "author": "author-id",
  "books": [
    {
      "number": 1,
      "title": "Book Title",
      "chapters": [
        {
          "number": 1,
          "latin": "Original Latin text...",
          "translation": "German translation..."
        }
      ]
    }
  ]
}
```

## Available Texts

- `de-bello-gallico.json` - Caesar's Gallic Wars (sample chapters included)
- `de-officiis.json` - Cicero's On Duties (sample sections included)

## Adding New Texts

1. Create a new JSON file with the work's slug as filename
2. Follow the structure above
3. Include Latin text and German translation for each chapter/section
4. Update the LatinReaderNew component to load the text

## Future Enhancements

- Full texts for all works
- Line-by-line annotations
- Vocabulary glossary integration
- AI-powered translation assistance
