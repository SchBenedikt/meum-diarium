import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '13',
  slug: 'er-ist-da',
  author: 'caesar',
  title: 'Er ist da.',

  excerpt: '',
  historicalDate: '100 v. Chr',
  historicalYear: -100,
  date: "2024-03-24",
  readingTime: 2,
  tags: ["Disclaimer", "Geburt", "Spenden"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/kkg_system_36041_Trimuvirat_von_Gaius_Julius_Casar_mit_Bezos_un_8094af79-7bf1-41d1-90f5-4e04f76403921.png',
  content: {
    diary: `Disclaimer: Meine gesamten Werke, wie De Bello Gallico, habe ich in der dritten Person geschrieben, damit es sachlich wirkt. Diesen Blog hier schreibe ich im Gegensatz dazu aus meiner persönlichen Sicht, so wie ich es erlebt habe. Sollte sich also eine ethnische Minderheit angegriffen fühlen, entschuldige ich mich. Gendern unterlasse ich nur aus Gründen der Lesbarkeit.

Aber jetzt kann es losgehen:

Endlich wurde ich geboren. Also versteht mich nicht falsch – ich bin jetzt schon ein wenig älter, ich kann ja schließlich schon meine Erlebnisse posten. Aber glaubt mir: Schon am Tag meiner Geburt, am 13. Juli 100 v. Chr., als ich in Rom geboren wurde, wusste ich, dass ich mal die Herrschaft über ganz Rom haben will. Damals habe ich noch nicht gedacht, dass die Welt größer ist. Jetzt will ich natürlich die Herrschaft über die Welt. Aber das nur nebenbei.

Ich entstamme dem angesehenen Geschlecht der Julier, die von der Göttin Venus abstammen. Meine Familie hat nicht wirklich viel Geld, aber dafür eine göttliche Abstammung. Daher ist es eigentlich auch meine Vorbestimmung, die Welt zu regieren. Findet Ihr nicht?

Auf alle Fälle: Meinen steinigen Weg zum Erfolg, an dem ihr euch gerne ein Vorbild nehmen könnt, werde ich in meinem neuen Blog chronologisch geordnet darstellen. Ihr, meine treuen Anhänger, seid die Ersten, die über meine neuesten Eroberungen erfahren werdet.

Im Krieg haben wichtige Ereignisse unscheinbare Ursachen.

Gaius Julius Caesar

Über diese Ursachen und wie sie wirklich passiert sind, nicht wie sie von meinen vielen Feinden fälschlich dargestellt werden, werde ich in diesem Blog schreiben.

Igitur lege cum voluptate!`,
    scientific: ``
  },
  translations: {
    "en": {
      "title": "He is here.",
      "excerpt": "My birth, my family, and my divine ancestry. The beginning of a legend.",
      "content": {
        "diary": `Disclaimer: I wrote my entire works, like *De Bello Gallico*, in the third person so that it appears objective. In contrast, I write this blog here from my personal point of view, as I experienced it. So should any ethnic minority feel attacked, I apologize. I only omit gender-neutral language for reasons of readability.

But now it can start:

Finally I was born. So don't get me wrong - I'm already a bit older now, after all I can already post my experiences. But believe me: Already on the day of my birth, on July 13, 100 BC, when I was born in Rome, I knew that I wanted to have dominion over all of Rome. back then I didn't think the world was bigger. Now, of course, I want dominion over the world. But that just by the way.

I come from the respected Julian family (Gens Iulia), descendants of the goddess Venus. My family doesn't really have much money, but divine ancestry instead. Therefore, it is actually my destiny to rule the world. Don't you think?

In any case: I will present my rocky road to success, which you are welcome to take as a model, chronologically in my new blog. You, my loyal followers, will be the first to know about my latest conquests.

In war, important events have inconspicuous causes.

Gaius Julius Caesar

About these causes and how they really happened, not as they are falsely portrayed by my many enemies, I will write in this blog.

*Igitur lege cum voluptate!* (So read with pleasure!)`,
        "scientific": `## Historical Context: Birth, Lineage, and the Myth of Destiny

Gaius Julius Caesar was born in Rome on July 13, 100 BC (though some sources suggest 102 BC). His early life and family background provided the essential foundation for his later political and military identity.

### The Gens Iulia and Divine Ancestry

Caesar belonged to the **Gens Iulia**, one of Rome's most ancient and venerable patrician families. The Julii claimed a legendary genealogy: they identified as descendants of **Iulus** (also known as Ascanius), the son of the Trojan prince **Aeneas**. Since Aeneas was the son of the goddess **Venus**, the Julii effectively claimed divine ancestry. In the highly religious and status-conscious world of the Roman Republic, this lineage was more than a mere boast; it was a potent source of political legitimacy and a justification for Caesar’s perceived "right" to leadership.

### Social and Financial Standing

Despite their noble name, the Julii Caesares were not a dominant force in the high-stakes politics of the 1st century BC. At the time of Caesar’s birth, the family was relatively modest in its financial means and lacked the immense wealth and immediate political influence held by the contemporary inner circle of the Senate (the *Optimates*). Caesar's later rise was therefore not a predictable inheritance of power but a result of his own strategic brilliance, calculated alliances, and military successes.

### The Childhood Environment

Caesar grew up in the **Subura**, a densely populated and somewhat disreputable neighborhood of Rome. This environment likely gave him a ground-level understanding of the urban masses (the *plebs*), an insight that would eventually make him the most successful *Popularis* leader of his generation. His education, led by the distinguished scholar Gnipho, ensured he was deeply versed in Greek and Latin rhetoric, preparing him for the political speechmaking that was essential for Roman advancement.`
      }
    },
    "la": {
      "title": "Adsum.",
      "excerpt": "Natus sum Romae. Genus meum a Venere descendit. Mundum regere volo.",
      "content": {
        "diary": "Tandem natus sum! XIII Kal. Sext. anno C a.C.n. Romae lucem vidi. Ex gente Iulia ortus sum, quae a dea Venere descendit. Pecuniam non multam habemus, sed nobilitatem summam. Fatum meum est mundum regere. Hic legitis de rebus gestis meis veris.",
        "scientific": "C. Iulius Caesar natus est Romae anno C a.C.n. (aut CII). Gens Iulia patriciam originem a Venere dea trahebat. Etsi nobiles, non divitissimi erant. Caesar autem gloriam familiae suae virtute auxit."
      }
    }
  }
};

export default post;
