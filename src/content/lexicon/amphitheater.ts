import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
  term: "Amphitheater",
  slug: "amphitheater",
  variants: ["Amphitheater", "Kolosseum"],
  definition: `Ein Amphitheater war ein monumentales ovales oder elliptisches Bauwerk der römischen Antike, das speziell für die Veranstaltung von Gladiatorenkämpfen, Tierhetzen (venationes) und anderen öffentlichen Spektakeln konzipiert wurde. Im Gegensatz zum griechischen Theater, das halbrund angelegt war und hauptsächlich für dramatische Aufführungen diente, war das Amphitheater vollständig geschlossen und verfolgend konzentrisch ansteigende Sitzränge rund um die zentrale Arena. Das berühmteste Beispiel ist das Kolosseum in Rom, das ursprünglich Amphitheatrum Flavium hieß und bis zu 50.000 Zuschauer aufnehmen konnte.

Die Architektur römischer Amphitheater war technisch hochentwickelt: Durch ein ausgeklügeltes System von Gängen und unterirdischen Räumen (hypogeum) konnten Gladiatoren, wilde Tiere und Bühnenaufbauten schnell in die Arena transportiert werden. Das Publikum war nach sozialer Stellung getrennt - die Kaiser und Senatoren saßen in den besten Plätzen nahe der Arena, während die einfachen Bürger und Frauen in den obersten Rängen Platz nahmen. Viele Amphitheater verfügten über ein ausziehbares Sonnensegel (velarium), das von Matrosen bedient wurde.

Amphitheater waren mehr als nur Unterhaltungsstätten - sie dienten als Orte der politischen Selbstdarstellung und sozialen Kontrolle. Durch die Ausrichtung kostspieliger Spiele (munera) konnten wohlhabende Bürger und Kaiser ihre Großzügigkeit demonstrieren und die Gunst des Volkes gewinnen. Diese Veranstaltungen förderten das Gemeinschaftsgefühl und vermittelten römische Werte wie Tapferkeit und militärische Stärke.`,
  category: "Gesellschaft",
  etymology: `Von griechisch 'amphi' (ringsum, beidseitig) und 'theatron' (Schauplätze). Wörtlich: Theater mit Sitzplätzen auf beiden Seiten.`,
  relatedTerms: ["Gladiator", "Arena", "Venationes"],
  translations: {
    "en": {
      "term": "Amphitheater",
      "definition": "An Amphitheater was a monumental oval or elliptical structure unique to Roman architecture, specifically designed for public spectacles like gladiatorial combat and wild animal hunts (*venationes*). Unlike the semi-circular Greek theater, the amphitheater was fully enclosed, featuring concentric tiers of seating surrounding a central arena. The most iconic example is the Colosseum (Flavian Amphitheater) in Rome, which could hold up to 50,000 spectators. These venues was highly engineered, often featuring an underground network (*hypogeum*) for traps and elevators, and a retractable awning (*velarium*) to protect patrons from the sun.",
      "etymology": "Greek 'amphi' (on both sides) + 'theatron' (place for viewing).",
      "category": "Architecture",
      "variants": ["Arena", "Colosseum"]
    },
    "la": {
      "term": "Amphitheatrum",
      "definition": "Amphitheatrum erat aedificium ovale vel ellipticum magnificum Romae antiquae, ad munera gladiatoria et venationes bestiarum celebranda factum. Diversum a theatro Graeco, amphitheatrum undique clausum erat cum gradibus ad sedendum dispositis. Clarissimum omnium est Amphitheatrum Flavium Romae, quod etiam Colosseum vocatur. In arena non solum pugnae gladiorum, sed etiam ludi scaenici et supplicia habebantur. Haec monumenta erant signa potentiae et luxuriae populi Romani.",
      "etymology": "Verbum Graecum significans 'theatrum circumquaque'.",
      "category": "Architectura",
      "variants": ["Harena"]
    }
  }
};

export default entry;
