import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: 'senatsreform',
  slug: 'senatsreform',
  author: 'caesar',
  title: 'Senatsreform – Erweiterung und Entmachtung der alten Netzwerke',
  latinTitle: 'Senatus Reformatio',
  excerpt: 'Warum ich den Senat vergrößerte: Provinzvertreter einbinden, Patronatsnetzwerke brechen, Verwaltung professionalisieren – und Widerstand streuen.',
  historicalDate: '46–44 v. Chr.',
  historicalYear: -46,
  date: new Date().toISOString().split('T')[0],
  readingTime: 10,
  tags: ['Reform','Institutionen','Senat','Verwaltung'],
  coverImage: '/images/caesar-hero.jpg',
  content: {
    diary: `Ich nahm dem Senat die Exklusivität, nicht die Stimme. Die alten Familien beherrschten Rom über Netzwerke, nicht über Kompetenz. Also öffnete ich die Türen: neue Männer, neue Provinzen, neue Stimmen.

Viele schrien Verrat an der Tradition. Doch Tradition ist dann stark, wenn sie Ordnung sichert – nicht wenn sie wenige bewahrt.`,
    scientific: `Die Senatsreform unter Caesar erhöhte die Anzahl der Senatoren auf etwa 900 und integrierte verstärkt Provinzialeliten.

## Mechanismus der Reform

- **Aufstockung**: größere Zahl reduziert Fraktionsmacht einzelner Häuser.
- **Integration**: Vertreter aus Gallien, Hispania u. a. gewinnen Mitspracherechte.
- **Professionalisierung**: Verwaltungsqualität durch breitere Kompetenzbasis.

## Politische Logik

- **Entmachtung der Optimaten-Netzwerke**: Stimmenverteilung erschwert Blockaden.
- **Legitimation imperialer Ordnung**: Rom repräsentiert Reich, nicht nur die Stadt.

## Kritik und Folge

Konservative sahen eine Entwertung des Amtes; tatsächlich verschob sich der Charakter des Senats von einer aristokratischen Domäne zu einem imperialen Beratungs- und Verwaltungsorgan. Unter Augustus wird dies als Prinzipat verfestigt.

Die Reform ist ein Instrument der Machtsicherung – und zugleich eine Modernisierung der Staatsverwaltung.`,
  },
  translations: {
    en: { title: '', excerpt: '', content: { diary: '', scientific: '' } },
    la: { title: '', excerpt: '', content: { diary: '', scientific: '' } },
  },
};

export default post;
