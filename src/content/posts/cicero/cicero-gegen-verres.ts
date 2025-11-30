import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '20',
    slug: 'cicero-gegen-verres',
    author: 'cicero',
    title: 'Cicero gegen Verres',
    excerpt: 'Die berühmten Reden gegen Verres',
    historicalDate: '70 v. Chr.',
    historicalYear: -70,
    date: '2024-07-26',
    readingTime: 3,
    tags: ['Korruption', 'Recht'],
    coverImage: '/images/post-default.jpg',
    content: {
      diary: `Die Sache gegen Verres ist mehr als nur ein Prozess. Es ist ein Kampf für die Gerechtigkeit und die Ehre Roms. Die Beweise seiner Plünderungen in Sizilien sind erdrückend. Meine Reden werden ihn entlarven und das Volk wird die Wahrheit erfahren.`,
      scientific: `Die Anklagereden gegen Gaius Verres im Jahr 70 v. Chr. etablierten Cicero als führenden Anwalt Roms. Obwohl Verres nach der ersten Rede freiwillig ins Exil ging, veröffentlichte Cicero die gesamte Anklageschrift ('In Verrem'), um die grassierende Korruption der Senatsaristokratie aufzudecken.`
    }
  };

export default post;
