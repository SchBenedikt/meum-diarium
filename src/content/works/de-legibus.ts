import { Work } from '@/types/blog';
const work: Work = {
  title: 'De Legibus',
  author: 'cicero',
  year: '52–51 v. Chr.',
  summary: `De Legibus (Über die Gesetze) ist Ciceros Dialog über die Grundlagen des Rechts und der Gesetzgebung. Als Ergänzung zu De Re Publica entwirft Cicero eine ideale Rechtsordnung, die auf dem Naturrecht basiert. Das Werk beginnt mit einer philosophischen Grundlegung: Das Recht entspringt nicht menschlicher Satzung, sondern der Natur selbst – der recta ratio (richtigen Vernunft), die allen Menschen gemeinsam ist.`,
  takeaway: `Wahres Recht ist nicht, was der Stärkere durchsetzt, sondern was der Vernunft entspricht. Cicero begründet das abendländische Naturrechtsdenken: Ungerechte Gesetze sind keine Gesetze. Ein zeitloses Fundament für Rechtsphilosophie und Menschenrechte.`,
  structure: [
    {
      title: 'Buch I: Naturrecht und Rechtsphilosophie',
      content: `Cicero legt die philosophischen Grundlagen: Das Recht stammt aus der Natur, nicht vom Menschen. Die Götter gaben allen Menschen die gemeinsame Vernunft. Deshalb gibt es ein universelles, unveränderliches Gesetz, das für alle Völker und Zeiten gilt. Dieses Naturrecht ist die Grundlage jedes positiven Rechts.`
    },
    {
      title: 'Buch II: Die religiösen Gesetze',
      content: `Cicero entwirft praktische Gesetze für den römischen Kultus: Die Götter müssen rein verehrt werden, ohne Prunk und Aberglauben. Neue Kulte brauchen staatliche Genehmigung. Die Pontifices wachen über die Religion. Die Auguren deuten den Götterwillen.`
    },
    {
      title: 'Buch III: Die Staatsgesetze',
      content: `Cicero skizziert die ideale Verfassungsordnung: Die Magistrate werden vom Volk gewählt. Die Gewaltenteilung sichert die Freiheit. Die Zensoren wachen über die Sitten. Das Volk hat das Recht auf Abstimmung, aber die Beschlüsse brauchen die Zustimmung des Senats.`
    }
  ],
  translations: {}
};
export default work;
