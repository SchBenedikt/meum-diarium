import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
  term: "Volkstribun",
  slug: "volkstribun",
  definition: "Ein Amt in der Römischen Republik, das geschaffen wurde, um die Interessen der Plebejer (des einfachen Volkes) gegen die der Patrizier (des Adels) zu vertreten. Volkstribunen besaßen weitreichende Befugnisse, insbesondere das Vetorecht (intercessio) gegen Maßnahmen aller anderen Magistrate.",
  category: "Politik",
  relatedTerms: ["plebejer", "republik", "senat"],
  translations: {
    en: {
      term: "Tribune of the Plebs",
      definition: "An office in the Roman Republic created to represent the interests of the plebeians (the common people) against those of the patricians (the nobility). Tribunes of the Plebs possessed extensive powers, especially the right of veto (intercessio) against measures of all other magistrates.",
      category: "Politics"
    },
    la: {
      term: "Tribunus Plebis",
      definition: "Magistratus in Re Publica Romana creatus ad tuendas plebis utilitates contra patricios. Tribuni plebis potestates magnas habebant, praecipue ius intercessionis adversus actus omnium aliorum magistratuum.",
      category: "Res Publica"
    }
  }
};

export default entry;
