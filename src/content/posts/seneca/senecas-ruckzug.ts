import { BlogPost } from '@/types/blog';

const post: BlogPost = {
    id: '39',
    slug: 'senecas-ruckzug',
    author: 'seneca',
    title: 'Senecas Rückzug',
    excerpt: 'Seneca zieht sich aus der Politik zurück',
    historicalDate: '62 n. Chr.',
    historicalYear: 62,
    date: '2024-07-26',
    readingTime: 2,
    tags: ['Rückzug', 'Philosophie'],
    coverImage: '/images/post-lucilius.jpg',
    content: {
      diary: `Es ist genug. Ich kann und will nicht länger Teil dieses Wahnsinns sein. Ich habe Nero um die Erlaubnis gebeten, mich ins Privatleben zurückzuziehen. Er hat widerwillig zugestimmt. Endlich kann ich mich ganz der Philosophie widmen, meinen Briefen an Lucilius, meinen Studien. Das ist der einzige wahre Reichtum.`,
      scientific: `Nachdem sein Einfluss auf Nero stark abgenommen hatte, zog sich Seneca im Jahr 62 n. Chr. aus dem politischen Leben zurück. Er widmete seine letzten Lebensjahre dem Schreiben und der Philosophie und verfasste in dieser Zeit einige seiner bedeutendsten Werke, darunter die 'Epistulae morales ad Lucilium'.`
    }
  };

export default post;
