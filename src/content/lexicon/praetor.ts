import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
    term: "Praetor",
    slug: "praetor",
    variants: ["Praetoren", "Praetur", "Proprätor"],
    definition: `Der Praetor war ein hoher Magistrat der römischen Republik und stand in der Ranghierarchie direkt unter den Konsuln. Die Praetur war ein zentrales Amt im cursus honorum, dem traditionellen Karriereweg römischer Politiker. Praetoren waren primär für die Rechtsprechung zuständig und leiteten Gerichtsverfahren in Rom. Der praetor urbanus richtete über Rechtsstreitigkeiten zwischen römischen Bürgern, während der praetor peregrinus für Fälle mit Beteiligung von Ausländern zuständig war. Mit der Expansion Roms wuchs die Anzahl der Praetoren von ursprünglich einem auf bis zu acht oder mehr, da sie auch als Statthalter in den Provinzen eingesetzt wurden. Praetoren verfügten über imperium, die höchste Amtsgewalt, wenn auch in geringerem Maße als Konsuln. Sie konnten militärische Kommandos übernehmen und Armeen führen. Nach ihrer Amtszeit wurden viele Praetoren als Proprätoren in die Provinzen entsandt, wo sie als Statthalter fungierten. Das Amt war ein Sprungbrett zum Konsulat, dem höchsten Amt der Republik.`,
    category: "Politik",
    etymology: `Von lateinisch 'praeire' (vorangehen, vorführen). Ursprünglich bezeichnete es den militärischen Anführer, später auch den Gerichtsvorsteher.`,
    relatedTerms: ["Konsul", "Senator", "Imperium"],
    translations: {
        "en": {
            "term": "Praetor",
            "definition": "The Praetor was a magistrate of the Roman Republic, ranking below the consul. They were primarily responsible for the administration of justice and could also command armies. The 'Praetor Urbanus' handled cases between citizens.",
            "etymology": "From Latin 'praeire' (to go before, lead).",
            "category": "Politics",
            "variants": ["Praetor Urbanus", "Praetor Peregrinus"]
        },
        "la": {
            "term": "Praetor",
            "definition": "Praetor erat magistratus populi Romani cum imperio, qui ius dicebat et exercitus ducere poterat. Secundus a consule dignitate fuit. Praetor Urbanus ius inter cives dixit.",
            "etymology": "A verbo 'praeire'.",
            "category": "Res Publica",
            "variants": []
        }
    }
};

export default entry;
