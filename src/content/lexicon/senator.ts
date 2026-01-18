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
            "definition": "A Senator was a member of the Roman Senate, the supreme council of state. Senators were usually former magistrates and held office for life. They debated legislation, foreign policy, and financial matters, advising the magistrates.",
            "etymology": "From Latin 'senex' (old man), implying a council of elders.",
            "category": "Politics",
            "variants": ["Patres Conscripti"]
        },
        "la": {
            "term": "Senator",
            "definition": "Senator erat socius Senatus Romani. Plerumque magistratus honoribus functi in senatum legebantur et ad vitam manebant. De re publica, legibus et bello consulebant.",
            "etymology": "A verbo 'senex'.",
            "category": "Res Publica",
            "variants": ["Patres"]
        }
    }
};

export default entry;
