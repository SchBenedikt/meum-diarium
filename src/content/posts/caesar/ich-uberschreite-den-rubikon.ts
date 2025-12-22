import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '4',
  slug: 'ich-uberschreite-den-rubikon',
  author: 'caesar',
  title: 'Ich überschreite den Rubikon',
  
  excerpt: 'Der Moment, der alles veränderte: Als ich mit meinen Legionen einen kleinen Fluss überquerte und damit den größten Bürgerkrieg Roms auslöste. War es Wahnsinn? Vielleicht. War es notwendig? Absolut.',
  historicalDate: '10. Januar 49 v. Chr.',
  historicalYear: -49,
  date: new Date().toISOString().split('T')[0],
  readingTime: 6,
  tags: ["Armee","Bürgerkrieg","Feind","Pompeius","Rom","Rubikon","Senat"],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/kkg_system_36041_image_of_gaius_julius_caesar_crossing_the_rubi_3316f166-9765-493e-a244-108688cce9301.png',
  content: {
    diary: `10. Januar 49 v. Chr. – ein kleiner Fluss, eine große Entscheidung.

Der Rubikon trennt Gallia Cisalpina von Italien. Ein Bach, kein Strom. Und doch liegt darin die Grenze zwischen Ordnung und Stillstand. Der Senat verlangt, dass ich mein Kommando niederlege und unbewaffnet nach Rom gehe – als Angeklagter, nicht als Konsul. Ich kenne ihre Absicht. Cato und die Optimaten wollen mich brechen, nicht richten.

Ich sehe die Männer der XIII. Gemina. Veteranen, vernarbt, diszipliniert, loyal. Acht Jahre lang haben sie mir die Tore Galliens geöffnet. Ich schulde ihnen Sicherheit nach dem Krieg – und ich schulde Rom Ordnung nach der Krise. Pompeius rennt vor Entscheidungen davon. Ich renne nicht.

Ich spreche den Satz, der zum Zeichen wurde: „Ἀνερρίφθω κύβος.“ – der Würfel sei geworfen. Als Lateiner sagen wir: „Alea iacta est.“ Es bedeutet nicht Leichtsinn. Es bedeutet Bindung. Ich binde mich an die Folgen meiner Entscheidung.

Wir setzen über. Kein Geschrei, kein Drama. Ein Marsch. In Italien fallen Städte uns zu, nicht weil ich drohe, sondern weil sie Ruhe wollen. Rom braucht einen Takt, nicht ein Dauergerangel. Dieser Schritt ist kein Triumph. Er ist ein unumkehrbarer Eintritt in Verantwortung.

Zusammenfassung: Ich überschreite den Rubikon, weil Vermeidung die Republik nicht rettet. Ich wähle den Weg, der Konsequenz erzwingt – und Ordnung möglich macht.`,
    scientific: `Die Rubikon-Überquerung gilt als Wendepunkt der späten Republik. Am 10. Januar 49 v. Chr. führte Caesar seine XIII. Legion über die Provinzgrenze nach Italien und brach damit bewusst mit überlieferter Ordnung: Ein Feldherr brachte bewaffnete Truppen in den Kernraum des Staates.

Rechtlich war dies ein Verstoß gegen die erwartete Entflechtung von Amt und Armee. Politisch war es eine Antwort auf das Ultimatum des Senats, das Caesar faktisch entrechtet hätte. Die Entscheidung setzte auf Geschwindigkeit, Loyalität und Überraschung; sie vermied die langsame Aushöhlung durch Prozesse und Blockaden.

Das überlieferte Wort „Alea iacta est“ rahmt den Schritt nicht als Willkür, sondern als Annahme der Folgen. In den folgenden Monaten fiel Italien ohne große Schlachten an Caesar, während Pompeius nach Osten wich, um Kräfte zu sammeln. Der Bürgerkrieg entfaltete sich über Spanien, Griechenland, Afrika und Spanien erneut; Pharsalos, Thapsus und Munda beendeten den Widerstand.

Kennzeichnend bleibt Caesars Clementia – die Milde gegenüber Besiegten – als politische Technik der Befriedung. Sie schuf Loyalität, aber auch den Keim des späteren Verrats. Historisch bewertet, markiert der Übergang weniger einen plötzlichen Bruch als die offen sichtbare Konsequenz einer bereits erodierten republikanischen Ordnung: Er beschleunigte das, was die Institutionen nicht mehr verhindern konnten.`
  },
  contentTitles: {
    diary: 'Entscheidung am Grenzfluss',
    scientific: 'Verfassungsbruch und Kriegsbeginn',
  },
  sidebar: {
    facts: [],
    quote: {
      text: 'Alea iacta est.',
      translation: 'Der Würfel ist gefallen.',
      source: 'Sueton, Divus Iulius 32 / Plutarch, Caesar 32',
    }
  },
  translations: {
  "en": {
    "title": "I Cross the Rubicon",
    "excerpt": "The moment that changed everything: When I crossed a small river with my legions and triggered Rome\\'s greatest civil war. Was it madness? Perhaps. Was it necessary? Absolutely.",
    "content": {
      "diary": "**January 10, 49 BC – The Day That Changed Everything**\n\nI stand here on the banks of the Rubicon – a ridiculously small river that one could almost jump over in good weather. But this inconspicuous stream is the border between my province Gallia Cisalpina and Italy. And these idiotic senators have decided that I am not allowed to cross it with my troops.\n\nWait a minute – let me summarize this: I have conquered Gaul for eight years, brought Rome indescribable wealth, extended the borders to the Rhine and across the English Channel. And now I'm supposed to just leave my legions here and walk unarmed to Rome? Only to be arrested by these corrupt Optimates?\n\n**As if.**\n\n**The Backstory – How the Senate Betrayed Me**\n\nIt all started when these senile old men in the Senate decided to prosecute me. For what? Oh, some \"constitutional violations\" during my consulship ten years ago. Cato – that self-righteous moralist – and his Optimates clique want to finish me off.\n\nThe deal was actually clear: I run for consulship for 48 BC, remain proconsul with immunity. Simple. Clean. Legal.\n\nBut then came this Senate resolution: \"Caesar shall lay down his command.\" Translated: \"Caesar shall surrender defenseless to his enemies.\"\n\nEven better: They have authorized Pompey – MY FORMER ALLY – to proceed against me. Pompey Magnus. The man who married my daughter Julia. The man with whom I founded the Triumvirate.\n\nTraitors. All of them.\n\n**The Moment of Decision**\n\nI only have one legion here – the XIII Gemina. About 5,000 men. Pompey has ten legions in Italy and Spain. The Senate controls the state treasury. The entire elite of Rome stands against me.\n\nEvery reasonable person would give up now.\n\nBut I am not every reasonable person. I am Gaius Julius Caesar.\n\nI look at my soldiers – veterans from the Gallic wars. Men who have been through hell with me. Who have bled for me. Who are loyal to me because I have brought them loot, land, and glory.\n\nThen I think of these fat, lazy senators in Rome. Who have never held a sword. Who have never fought a battle. Who think they can just eliminate me like a annoying fly.\n\n**\"Ἀνερρίφθω κύβος!\" – The die is cast!**\n\nI say it in Greek because I am an educated man – not like these philistines in the Senate. (Brutus would understand. Cicero probably too, the old windbag.)\n\nIt's a quote from Menander. Dramatic. Theatrical. Just right for this moment.\n\nIn Latin: **\"Alea iacta est\"** – The dice are cast.\n\nWhat does that mean? Simple: There is no turning back. I have made my decision. The Senate wanted war? They will get war.\n\nI give the command: \"Forward.\"\n\nThe XIII Legion marches across the Rubicon.\n\n**Technically speaking, I am now a criminal.** A traitor. An enemy of the state.\n\n**Practically speaking, I am the only man who can save Rome – from itself.**",
      "scientific": ""
    }
  },
  "la": {
    "title": "Rubiconem Transeo",
    "excerpt": "Momentum quod omnia mutavit: Cum cum legionibus meis parvum flumen transii et maximum bellum civile Romae incendi. Insanianne fuit? Fortasse. Necessarianne? Omnino.",
    "content": {
      "diary": "**X Kalendas Ianuarias XLIX a.C.n. – Dies Qui Omnia Mutavit**\n\nSto hic ad ripam Rubiconis – flumen ridicule parvum quod tempore bono fere transsilire possis. Sed hic rivus inconspicuus est limes inter provinciam meam Galliam Cisalpinam et Italiam. Et hi stulti senatores decreverunt me cum copiis meis eum transire non licere.\n\nMane – permitte mihi hoc summare: Octo annos Galliam subegi, Romae divitias incredibiles attuli, fines usque ad Rhenum et trans Oceanum Britannicum prorogavi. Et nunc legiones meas hic relinquere et inermis Romam ambulare debeo? Ut ab his corruptis Optimatibus comprehendar?\n\n**Quasi.**\n\n**Historia Antecedente – Quomodo Senatus Me Prodidit**\n\nOmnia inceperunt cum hi seniles viri in Senatu decreverunt me accusare. Qua de causa? Ah, quaedam \"violationes constitutionis\" durante consulatu meo decem annos ante. Cato – hic hypocrita moralis – et sua Optimatum factio me delere volunt.\n\nPactum re vera clarum erat: Consulatum peto anno XLVIII a.C.n., maneo proconsul cum immunitate. Simplex. Purus. Legalis.\n\nSed tum venit hoc senatus consultum: \"Caesar imperium deponat.\" Interpretatum: \"Caesar se inermem inimicis tradat.\"\n\nEtiam melius: Pompeium – MEUM SOCIUM PRIOREM – contra me procedere auctorizaverunt. Pompeius Magnus. Vir qui filiam meam Iuliam in matrimonium duxit. Vir cum quo Triumviratum fundavi.\n\nProditores. Omnes.",
      "scientific": ""
    }
  }
}
};

export default post;
