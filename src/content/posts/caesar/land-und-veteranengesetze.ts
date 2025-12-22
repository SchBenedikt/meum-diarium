import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: 'land-und-veteranengesetze',
  slug: 'land-und-veteranengesetze',
  author: 'caesar',
  title: 'Veteranen und Land',
  latinTitle: 'Leges Agrariae et Veteranorum',
  excerpt: 'Nach den Kriegen brauchen die Männer Land, die Städte Ruhe und der Staat Planbarkeit. Meine Veteranenpolitik stabilisierte Rom.',
  historicalDate: '59, 49–46 v. Chr.',
  historicalYear: -59,
  date: new Date().toISOString().split('T')[0],
  readingTime: 9,
  tags: ['Reform','Sozialpolitik','Veteranen','Landgesetz'],
  coverImage: '/images/caesar-hero.jpg',
  content: {
    diary: `Ein Heer folgt dem Feldherrn, solange es weiß, wofür es kämpft – und was danach kommt. Ich versprach Land, nicht als Almosen, sondern als Anerkennung. Städte wurden entlastet, ländliche Räume belebt.

Veternanen ohne Perspektive werden zu Gefahr. Veternanen mit Land werden zu Säulen des Staates. Ich verteilte Staatsland, gründete Kolonien und verwandelte Sieger in Siedler.

Das ist Politik im Rhythmus von Krieg und Frieden.`,
    scientific: `Caesars Veteranenpolitik knüpft an die republikanische Tradition der Landzuweisungen an (z. B. Gracchische Reformansätze), ist jedoch strategisch eingebettet in Nachkriegsstabilisierung.

## Elemente der Veteranenpolitik

1. **Landzuweisungen**: Staatsland (ager publicus) an Veteranen.
2. **Koloniegründungen**: Veteranensiedlungen in Italien und ausgewählten Provinzen.
3. **Schuldenerleichterungen**: Anschluss an Zins- und Bewertungsreformen.

## Politische Logik

- **Bindung**: Loyalität der Legionen über Dienstende hinaus.
- **Entlastung**: Stadtarme werden nicht zu Instabilitätsfaktoren.
- **Wirtschaft**: Produktive Nutzung von Brachland, Einbindung in Steuer- und Versorgungssysteme.

## Wirkung

Die Veteranengesetze reduzierten das Risiko von „heimkehrenden Heeren ohne Perspektive“, das in der späten Republik wiederholt zu Unruhen geführt hatte. Sie verbanden Sozialpolitik mit Sicherheits- und Wirtschaftspolitik und spielten eine zentrale Rolle in Caesars Konsolidierungsphase.`,
  },
  translations: {
    en: { title: '', excerpt: '', content: { diary: '', scientific: '' } },
    la: { title: '', excerpt: '', content: { diary: '', scientific: '' } },
  },
};

export default post;
