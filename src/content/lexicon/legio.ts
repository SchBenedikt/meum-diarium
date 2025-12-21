import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
  term: "Legio",
  slug: "legio",
  variants: ["Legion"],
  definition: `Eine Legio (Legion) war die größte militärische Einheit der römischen Armee, bestehend aus etwa 4.200 bis 6.000 schwerbewaffneten Infanteristen (Legionäre) und Unterstützungstruppen. Jede Legion war in Kohorten, Manipel und Centurien unterteilt und wurde von einem Legaten kommandiert. Legionen waren das Rückgrat der römischen Militärmacht und ermöglichten die Eroberung und Verteidigung des Reiches.`,
  category: "Militär",
  etymology: `Von lateinisch 'legere' (auswählen, auslesen), da ursprünglich die wehrfähigen Männer für den Militärdienst ausgewählt wurden. Der Begriff entwickelte sich zur Bezeichnung der gesamten militärischen Einheit. In der römischen Kaiserzeit wurde die Legion zur Standardformation der Armee.`,
  relatedTerms: ["Cohors","Legatus"],
  translations: {
    "en": {
        "term": "Legion",
        "definition": "A legio (legion) was the largest military unit of the Roman army, consisting of approximately 4,200 to 6,000 heavily armed infantrymen (legionaries) and support troops. Each legion was divided into cohorts, maniples, and centuries and was commanded by a legate.",
        "etymology": "From Latin 'legere' (to choose, to select), as initially able-bodied men were selected for military service.",
        "category": "Military",
        "variants": []
    },
    "la": {
        "term": "Legio",
        "definition": "Legio maxima unitas militaris exercitus Romani erat, constans circiter 4.200 ad 6.000 militibus graviter armatis (legionariis) et copiis auxiliaribus. Quaeque legio in cohortes, manipulos et centurias divisa erat et a legato ducebatur.",
        "etymology": "E verbo latino 'legere' (eligere, seligere), quod initio viri idonei ad militiam selecti sunt.",
        "category": "Militaris",
        "variants": []
    }
}
};

export default entry;
