import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '3',
    slug: 'iden-des-maerz',
    title: 'Die Iden des März',
    latinTitle: 'Idus Martiae',
    excerpt: 'Et tu, Brute? Die letzten Stunden.',
    date: '2024-02-10',
    historicalDate: '15. März 44 v. Chr.',
    historicalYear: -44,
    author: 'caesar',
    tags: ['Attentat', 'Tod'],
    readingTime: 6,
    coverImage: '/images/post-ides-of-march.jpg',
    content: {
      diary: `*[Posthum rekonstruiert]*

Der Morgen begann wie jeder andere. Calpurnia flehte mich an, nicht in den Senat zu gehen. Sie hatte schlecht geträumt.

Als ich Brutus sah – meinen Brutus –, da wusste ich: Es ist vorbei.

**"Καὶ σύ, τέκνον?"** – Auch du, mein Kind?

*Acta est fabula.*`,
      scientific: `## Die Ermordung Caesars (44 v. Chr.)

Das Attentat fand am 15. März 44 v. Chr. in der Curia des Pompeius statt. 23 Dolchstiche führten zum Tod.

### Die Verschwörer
Etwa 60 Senatoren, angeführt von Marcus Brutus und Gaius Cassius.

**Quellen:** Sueton, Plutarch, Appian`,
    },
  };

export default post;
