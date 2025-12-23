import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: 'forum-iulium-und-infrastruktur',
  slug: 'forum-iulium-und-infrastruktur',
  author: 'caesar',
  title: 'Forum Iulium',
  
  
  latinTitle: 'Forum Iulium et Opera Publica',
  excerpt: 'Warum ich baute: Entlastung des alten Forums, Sichtbarkeit staatlicher Autorität, Arbeitsplätze und Prestige für Rom.',
  historicalDate: '46 v. Chr.',
  historicalYear: -46,
  date: new Date().toISOString().split('T')[0],
  readingTime: 8,
  tags: ["Reform","Stadtplanung","Infrastruktur","Forum"],
  coverImage: 'https://videos.openai.com/az/vg-assets/task_01kd5f5170frwvsp2h0f2w9gmv%2F1766488996_img_1.webp?se=2025-12-26T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-12-23T02%3A21%3A13Z&ske=2025-12-30T02%3A26%3A13Z&sks=b&skv=2024-08-04&sig=/UZihoq6U6yWiOy5L3g2fEFa2eAj5EjLGd9EuAE0lAw%3D&ac=oaivgprodscus2',
  content: {
    diary: `Rom war zu eng für Rom. Das alte Forum erstickte in seiner eigenen Geschichte. Ich schuf Raum: Das Forum Iulium, geordnet, klar, ein öffentliches Herz, das den Rhythmus der Stadt sichtbar machte.

Straßen, Bauten, Tempel – die Stadt ist nicht nur Kulisse, sie ist Teil der Politik. Wer Ordnung sehen will, muss sie auch sehen können.`,
    scientific: `Caesars Baupolitik kulminiert im Forum Iulium, dessen Errichtung mehrere zentrale Ziele verfolgte. Im Mittelpunkt stand die Entlastung des überfüllten Forum Romanum durch die Schaffung neuer räumlicher Strukturen für Gericht, Politik und Markt.<br>

<br>Das Forum Iulium erfüllte verschiedene wichtige Funktionen für die Stadt Rom. Die räumliche Entzerrung schuf dringend benötigte neue Flächen für Gerichte und öffentliche Geschäfte, die im alten Forum nicht mehr untergebracht werden konnten. Gleichzeitig diente das neue Forum der symbolischen Ordnung, indem es die Sichtbarkeit der neuen Machtbalance konkret im Stadtraum manifestierte. Darüber hinaus setzte das Bauprojekt einen bedeutenden ökonomischen Impuls durch die Schaffung von Beschäftigung und die umfassende Verbesserung der städtischen Infrastruktur.<br>

<br>Über das Forum hinaus umfasste Caesars Infrastrukturpolitik zahlreiche weitere Maßnahmen. Straßensanierungen und die Errichtung öffentlicher Bauten verstärkten die Sichtbarkeit staatlicher Autorität und schufen Vertrauen sowie institutionelle Routine im öffentlichen Leben.<br>

<br>Die Baupolitik war nicht bloß Prestige oder repräsentative Selbstdarstellung. Sie stellte vielmehr eine Verwaltungsreform in Stein dar, die durch klare Wege, klare Räume und klare Abläufe die Funktionsfähigkeit der städtischen Administration nachhaltig verbesserte.`
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
