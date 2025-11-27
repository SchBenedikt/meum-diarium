export type Author = {
  id: string;
  name: string;
  initials: string;
  bio: string;
};

export type Post = {
  id: string;
  authorId: string;
  type: "diary" | "scientific";
  title: string;
  date: string;
  imageId: string;
  excerpt: string;
};

export const authors: Author[] = [
  {
    id: "caesar",
    name: "Gaius Julius Caesar",
    initials: "JC",
    bio: "Dictator perpetuo, Pontifex Maximus, imperator, and man of letters. Currently chronicling my campaigns and navigating the political landscape of Rome.",
  },
  {
    id: "cicero",
    name: "Marcus Tullius Cicero",
    initials: "MC",
    bio: "Consul, orator, philosopher, and staunch defender of the Republic. Documenting my thoughts on law, rhetoric, and the precarious state of our government.",
  },
];

export const posts: Post[] = [
  {
    id: "post1",
    authorId: "caesar",
    type: "diary",
    title: "The Die is Cast",
    date: "January 10, 49 BC",
    imageId: "crossing-rubicon",
    excerpt:
      "Today, I led the 13th Legion across the Rubicon. A small stream, yet it marks the boundary between my province and Italy. There is no turning back now. Alea iacta est.",
  },
  {
    id: "post2",
    authorId: "caesar",
    type: "scientific",
    title: "On the Engineering of the Rhine Bridge",
    date: "55 BC",
    imageId: "roman-aqueduct",
    excerpt:
      "A technical account of the construction of a temporary wooden bridge across the Rhine. The feat, completed in ten days, was a demonstration of Roman engineering prowess and served to facilitate the passage of legions into Germanic territory.",
  },
  {
    id: "post3",
    authorId: "caesar",
    type: "diary",
    title: "Victory at Alesia",
    date: "October 2, 52 BC",
    imageId: "gaul-battle",
    excerpt:
      "Vercingetorix has surrendered. The gallic chieftain, once a formidable adversary, laid down his arms at my feet. This victory marks the end of the Gallic Wars. A triumph for Rome, and for me.",
  },
  {
    id: "post4",
    authorId: "cicero",
    type: "diary",
    title: "A Conspiracy Uncovered",
    date: "November 8, 63 BC",
    imageId: "roman-senate",
    excerpt:
      "I have delivered my first oration against Catiline in the Senate. The audacity of the man, to appear among us while his plot to overthrow the Republic is known! The city holds its breath.",
  },
  {
    id: "post5",
    authorId: "cicero",
    type: "scientific",
    title: "De Re Publica: On the Ideal State",
    date: "c. 51 BC",
    imageId: "roman-forum",
    excerpt:
      "An exploration of the best form of government, drawing upon the Roman constitution as a model. A mixed constitution, balancing monarchy, aristocracy, and democracy, is proposed as the most stable and just system.",
  },
  {
    id: "post6",
    authorId: "cicero",
    type: "diary",
    title: "Exile's Lament",
    date: "March, 58 BC",
    imageId: "library-of-alexandria",
    excerpt:
      "Forced from my home, my city, my life's work. This exile is a bitter pill, a reward for my devotion to the Republic. I find solace only in philosophy and the letters I send to Atticus.",
  },
    {
    id: "post7",
    authorId: "caesar",
    type: "diary",
    title: "Ides of March",
    date: "March 15, 44 BC",
    imageId: "caesar-bust",
    excerpt:
      "A strange feeling of dread this morning. Calpurnia's dreams were troubled. The Senate convenes today. Et tu, Brute? The thought is a fleeting shadow. I must go.",
  },
   {
    id: "post8",
    authorId: "cicero",
    type: "diary",
    title: "On Caesar's Assassination",
    date: "March 16, 44 BC",
    imageId: "cicero-bust",
    excerpt:
      "The tyrant is dead. A day of liberation for the Republic! Yet, the future is uncertain. The city is a tinderbox, and I fear what Antony's ambition may ignite.",
  },
];
