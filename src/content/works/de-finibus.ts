import { Work } from '@/types/blog';
const work: Work = {
  title: 'De Finibus',
  author: 'cicero',
  year: '45 v. Chr.',
  summary: `De Finibus Bonorum et Malorum (Über die Ziele des Guten und Bösen) ist Ciceros Hauptwerk zur Ethik. Er stellt die drei wichtigsten hellenistischen Schulen dar und prüft sie kritisch: Epikureer (Lust als höchstes Gut), Stoiker (Tugend als einziges Gut) und die Schule des Aristoteles (Vereinbarkeit von Tugend und äußeren Gütern).`,
  takeaway: `Die Frage nach dem höchsten Gut ist die wichtigste der Philosophie. Cicero zeigt, dass die stoische Position – Tugend als einziges Gut – am überzeugendsten ist, aber auch die aristotelische Synthese ihre Verdienste hat. Seine Auseinandersetzung mit Epikur ist eine der scharfsinnigsten der Antike.`,
  structure: [
    {
      title: 'Buch I–II: Die epikureische Lehre',
      content: `Cicero lässt Lucius Torquatus die epikureische Position vortragen: Das höchste Gut ist die Lust (voluptas), das höchste Übel der Schmerz. Tugend ist nur wertvoll, weil sie Lust verschafft. Cicero widerlegt diese Position in Buch II: Die epikureische Ethik ist inkonsequent und kann keine moralischen Unterschiede begründen.`
    },
    {
      title: 'Buch III–IV: Die stoische Lehre',
      content: `Cato der Jüngere trägt die stoische Lehre vor: Das einzige Gut ist die Tugend (honestum), das einzige Übel die Schlechtigkeit. Alle anderen Dinge sind gleichgültig (adiaphora). Der Weise ist auch auf der Folter glücklich. Cicero kritisiert in Buch IV einzelne Punkte, stimmt aber in der Grundrichtung zu.`
    },
    {
      title: 'Buch V: Die peripatetische Lehre',
      content: `Marcus Pupius Piso trägt die Lehre des Aristoteles vor: Es gibt mehrere Güter – geistige und körperliche – aber die Tugend ist das höchste. Wahres Glück braucht tugendhaftes Leben plus ein Mindestmaß an äußeren Gütern. Cicero neigt zu dieser vermittelnden Position, die dem gesunden Menschenverstand am nächsten kommt.`
    }
  ],
  translations: {}
};
export default work;
