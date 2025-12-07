import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
  term: "Republik",
  slug: "republik",
  definition: "Die Römische Republik (ca. 509–27 v. Chr.) war die Phase der antiken römischen Zivilisation, die durch eine republikanische Regierungsform gekennzeichnet war. An die Stelle eines Königs traten jährlich gewählte Magistrate. Die Macht war zwischen dem Senat, den Magistraten und den Volksversammlungen (Comitia) aufgeteilt.",
  category: "Politik",
  etymology: "Von lat. 'res publica' (öffentliche Sache).",
  relatedTerms: ["senat", "konsul", "volkstribun"],
  translations: {
    en: {
      term: "Republic",
      definition: "The Roman Republic (c. 509–27 BC) was the phase of ancient Roman civilization characterized by a republican form of government. Instead of a king, magistrates were elected annually. Power was divided between the Senate, the magistrates, and the popular assemblies (Comitia).",
      category: "Politics",
      etymology: "From Latin 'res publica' (public affair)."
    },
    la: {
      term: "Res Publica",
      definition: "Res Publica Romana (c. DIX–XXVII a.C.n.) erat tempus humanitatis Romanae antiquae forma rei publicae gubernatum. Pro rege magistratus quotannis eligebantur. Potestas divisa erat inter Senatum, magistratus et comitia.",
      category: "Res Publica",
      etymology: "Ex 'res publica' (res populi)."
    }
  }
};

export default entry;
