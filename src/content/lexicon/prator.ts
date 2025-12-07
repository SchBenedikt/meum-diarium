import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
  term: "Prätor",
  slug: "prätor",
  definition: "Ein hoher Magistrat in der Römischen Republik, im Rang direkt unter dem Konsul. Die Hauptaufgabe der Prätoren war die Rechtsprechung in Rom. Nach ihrem Amtsjahr übernahmen sie oft als Proprätor die Verwaltung einer Provinz.",
  category: "Recht",
  relatedTerms: ["konsul", "magistrat", "cursus-honorum"],
  translations: {
    en: {
      term: "Praetor",
      definition: "A high magistrate in the Roman Republic, ranking directly below the Consul. The main duty of the Praetors was the administration of justice in Rome. After their year of office, they often took over the administration of a province as Propraetor.",
      category: "Law"
    },
    la: {
      term: "Praetor",
      definition: "Magistratus summus in Re Publica Romana, dignitate directe infra consulem. Officium praecipuum praetorum erat iurisdictio Romae. Post annum magistratus saepe ut propraetor provinciam administrabant.",
      category: "Ius"
    }
  }
};

export default entry;
