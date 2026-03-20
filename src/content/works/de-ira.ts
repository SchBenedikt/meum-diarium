import { Work } from '@/types/blog';

const work: Work = {
  title: 'De Ira',
  author: 'seneca',
  year: '55 n. Chr.',
  slug: 'de-ira',
  summary: `Senecas Abhandlung über den Zorn. Ein psychologisches Meisterwerk: Wie man Wut erkennen, kontrollieren und überwinden kann. Praktische Ratschläge zur Affektbeherrschung durch stoische Philosophie.`,
  takeaway: `Zorn als zerstörerische Emotion. Seneca analysiert die Entstehung von Wut und ihre Auswirkungen auf Körper und Geist. Bietet konkrete Techniken zur Selbstbeherrschung: verzögerte Reaktion, rationale Analyse, Atemtechniken. Ein zeitloses Werk zur emotionalen Intelligenz.`,
  structure: [
    {
      title: 'Buch I: Die Natur des Zorns',
      content: `Untersuchung der physiologischen und psychologischen Aspekte des Zorns. Wut als natürliche Reaktion auf wahrgenommene Kränkungen. Analyse der körperlichen Symptome: Hitze, Zittern, Erröten.`
    },
    {
      title: 'Buch II: Ursachen und Auslöser',
      content: `Externe und interne Faktoren, die Zorn auslösen. Beleidigungen, Ungerechtigkeit, Übermüdung, finanzielle Sorgen. Rolle der Vorstellungskraft und der Erwartung.`
    },
    {
      title: 'Buch III: Beherrschung des Zorns',
      content: `Praktische Anweisungen zur Zornbeherrschung. Sofortige Maßnahmen: Atmung, Zählen bis zehn, rationale Überprüfung. Langfristige Strategien: Philosophische Schulung, Meditation, Vermeidung von Zornauslösern.`
    }
  ]
};

export default work;
