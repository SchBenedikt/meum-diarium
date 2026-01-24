import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
    term: "Senator",
    slug: "senator",
    variants: [],
    definition: `Mitglied des römischen Senats, des höchsten Regierungsorgans der römischen Republik. Senatoren waren meist ehemalige Magistrate und bildeten eine Elite aus etwa 300-600 Männern.`,
    category: "Politik",
    etymology: `Von lateinisch 'senex' (der Alte, Greis). Der Begriff betont die Weisheit und Erfahrung, die von den Senatsmitgliedern erwartet wurde.`,
    relatedTerms: [],
    translations: {
        "en": {
            "term": "Senator",
            "definition": "A Senator was a member of the Roman Senate, the primary consultative and governing body of the Roman Republic and later the Empire. Historically derived from the council of elders (*senex*), the Senate reached about 300 to 600 members, mostly consisting of former high-ranking magistrates (cursus honorum). Senators held their seats for life, though they could be removed by censors for misconduct. They exercised immense authority over foreign policy, state finances, and the assignment of provincial commands. While the Senate's advice (*senatus consultum*) was technically non-binding, it held massive political weight until the rise of imperial autocracy eclipsed its traditional power.",
            "etymology": "From Latin 'senex' (old man), implying a council of elders.",
            "category": "Politics",
            "variants": ["Patres Conscripti"]
        },
        "la": {
            "term": "Senator",
            "definition": "Senator erat socius Senatus Romani, qui fuit maximum consilium rei publicae. Huic ordini senatorio adhaerebant plerumque viri qui magistratus (sicut quaesturam aut praeturam) sustinuerant. Senatores de legibus, aerario et bellis consulebant; eorum 'senatus consulta' magnam auctoritatem apud magistratus et populum habuerunt. In senatu auctoritas et sapientia (itaque nomen a 'senex') praecipuae habebantur. Augustus et successores eius potestatem senatus paulatim minuerunt, sed dignitas senatoria per saecula mansit.",
            "etymology": "A verbo 'senex'.",
            "category": "Res Publica",
            "variants": ["Patres"]
        }
    }
};

export default entry;
