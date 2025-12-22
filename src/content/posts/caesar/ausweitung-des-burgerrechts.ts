import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: 'ausweitung-des-burgerrechts',
  slug: 'ausweitung-des-burgerrechts',
  author: 'caesar',
  title: 'Erweiterung des Bürgerrechts',
  latinTitle: 'Civitas Amplificata',
  excerpt: 'Warum ich Provinzialeliten zu Römern machte: Verwaltung professionalisieren, Loyalität sichern, Rom erweitern – ohne Besatzung allein.',
  historicalDate: '49–46 v. Chr.',
  historicalYear: -49,
  date: new Date().toISOString().split('T')[0],
  readingTime: 10,
  tags: ["Reform","Staatsrecht","Integration","Provinzen"],
  coverImage: '/images/caesar-hero.jpg',
  content: {
    diary: `Viele sehen nur meine Legionen. Ich sehe die Menschen, aus denen ein Reich besteht. Ein Staat, der nur herrscht, ohne zu integrieren, regiert kurz. Ein Staat, der Talente aufnimmt, regiert lang.

Ich holte italische und provinziale Eliten in unser Bürgerrecht. Nicht als Gnade, sondern als Anerkennung. Sie verwalteten, führten Legionen, sprachen Recht. Dafür verlangte ich: Loyalität zu Rom, Loyalität zu mir.

Manche nannten es Entweihung der alten Ordnung. Ich nenne es Erweiterung der Ordnung. Rom wurde nicht kleiner, wenn andere Römer wurden – es wurde größer.`,
    scientific: `Die Ausweitung des römischen Bürgerrechts unter Caesar ist Teil eines länger währenden Integrationsprozesses (beginnend in der späten Republik, kulminierend unter Augustus).

## Ziele und Instrumente

- **Elitenbindung**: Provinzialaristokratie erhält Zugang zu Ämtern und Senat.
- **Verwaltungsqualität**: Rekrutierung kompetenter, lokal verankerter Führungskräfte.
- **Militärische Steuerung**: Loyalität durch rechtlichen Status und Karrierewege.

## Historischer Kontext

- Bereits zuvor: Lex Iulia und Lex Plautia Papiria (90–89 v. Chr.) erweiterten Bürgerrecht auf italische Verbündete.
- Unter Caesar: Beschleunigung der Integration ausgewählter Provinzialeliten, bes. Gallia Narbonensis und Hispania.

## Effekte

- **Politische Stabilität**: Mehr Repräsentation, weniger Revolten.
- **Zentrums-Peripherie-Ausgleich**: Rom als integrativer Kern statt reiner Eroberer.
- **Langfristiges Vermächtnis**: Grundlage für die Reichsverwaltung des Prinzipats.

Die Bürgerrechtsausweitung dient der Staatskonsolidierung: Ein Imperium wird tragfähig, wenn es Zugehörigkeit schafft.`
  },
  translations: {
  "en": {
    "title": "",
    "excerpt": "",
    "content": {
      "diary": "",
      "scientific": ""
    }
  },
  "la": {
    "title": "",
    "excerpt": "",
    "content": {
      "diary": "",
      "scientific": ""
    }
  }
}
};

export default post;
