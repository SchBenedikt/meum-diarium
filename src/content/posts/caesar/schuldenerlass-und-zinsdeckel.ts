import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: 'schuldenerlass-und-zinsdeckel',
  slug: 'schuldenerlass-und-zinsdeckel',
  author: 'caesar',
  title: 'Schuld und Zins',
  latinTitle: 'Remissio Debitorum et Usurarum Modus',
  excerpt: 'Wie ich Rom nach dem Bruch beruhigte: Begrenzte Zinsforderungen, realistische Immobilienbewertung und Schutz vor Plünderung der Schuldner.',
  historicalDate: '49–46 v. Chr.',
  historicalYear: -49,
  date: new Date().toISOString().split('T')[0],
  readingTime: 9,
  tags: ['Reform','Ökonomie','Krise','Bürgerkrieg'],
  coverImage: '/images/caesar-hero.jpg',
  content: {
    diary: `Der Bürgerkrieg hatte Rom zerrissen. Manche häuften Gewinne, andere verloren alles. Ich sah Männer, die ihre Häuser für einen Bruchteil des Wertes verkaufen mussten – nicht, weil sie schlechte Verwalter gewesen wären, sondern weil Krieg keine normalen Preise kennt.

Ich entschied mich gegen das Chaos. Zinsen, die aus der Kriegsnot stiegen, mussten begrenzt werden. Forderungen, die auf aufgeblähte Schätzungen gebaut waren, sollten auf den Zustand vor dem Krieg zurückgeführt werden. Nicht, um Schuld zu leugnen, sondern um Maß und Mitte zurückzubringen.

Ich gab ein klares Signal: Rom war wieder eine Ordnungsmacht. Der Mann, der seine Schulden ehrlich bediente, bekam Zeit und Schutz. Der Mann, der aus Ruin Gewinn schlagen wollte, fand Grenzen. Die Märkte beruhigten sich, Volksunruhen flauten ab, Veteranen hatten Perspektive.

Ich hielt mich fern von radikalen Enteignungen. Ich reduzierte Exzesse. Denn nach einem Krieg braucht ein Reich Verlässlichkeit – keine weiteren Brüche.`,
    scientific: `Caesars Maßnahmen zu Schulden und Zinsen gehören zu seinen ökonomischen Stabilisierungsreformen nach dem Ausbruch des Bürgerkrieges (ab 49 v. Chr.). Quellen sprechen von Einschränkungen übermäßiger Zinsforderungen und Realwertbewertungen von Sicherheiten.

## Ausgangslage: Kreditmärkte in der Krise

- **Kriegsschock**: Flucht, Unterbrechung von Handel, Einbruch der Liquidität.
- **Preisverzerrung**: Immobilien und Land wurden unter Zwang verkauft – Marktpreise bildeten Knappheit und Panik ab.
- **Zinsanstieg**: Hohe Risikoaufschläge führten zu Wucher.

## Maßnahmen im Kern

1. **Zinsdeckel**: Begrenzung von Usura (Zinsen) bzw. der kumulierten Zinslast über die Dauer.
2. **Bewertungsgrundlage**: Immobilien und Sicherheiten wurden zu **Vorkriegspreisen** bewertet – Schutz vor Krisenspekulation.
3. **Tilgungspfade**: Schuldner erhielten geordnete Fristen statt sofortigem Ausverkauf.

Diese Maßnahmen sind in der Tradition populärer Politik (Optimierung sozialer Stabilität, Bindung von Klientel, Beruhigung urbaner Massen) zu sehen, jedoch mit rationalem Fokus auf Marktberuhigung statt Enteignung.

## Wirkung und Grenzen

- **Kurzfristige Entlastung**: verhindert Ketteninsolvenzen, stabilisiert Eigentum.
- **Politische Ruhe**: senkt Protestpotenzial in Rom.
- **Moral Hazard?** begrenzt durch beibehaltene Rückzahlungspflichten; keine generelle Schuldstreichung.

Die Reformen sind pragmatische Nachkriegsökonomie: Reduktion extremer Peaks, Reetablierung von Erwartungsstabilität und Vertrauenssignalen. In Verbindung mit Veteranensiedlungen und Infrastrukturprojekten bildet dies die wirtschaftliche Basis von Caesars Alleinherrschaft.`,
  },
  translations: {
    en: { title: '', excerpt: '', content: { diary: '', scientific: '' } },
    la: { title: '', excerpt: '', content: { diary: '', scientific: '' } },
  },
};

export default post;
