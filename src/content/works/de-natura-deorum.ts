import { Work } from '@/types/blog';
const work: Work = {
  title: 'De Natura Deorum',
  author: 'cicero',
  year: '45 v. Chr.',
  summary: `De Natura Deorum (Über das Wesen der Götter) ist Ciceros umfassendste Darstellung der antiken Theologie. In Dialogform diskutieren drei Sprecher die Positionen der drei wichtigsten Philosophenschulen: der Epikureer (Götter existieren, kümmern sich aber nicht um die Welt), der Stoiker (die Welt ist göttlich durchwaltet) und der Akademiker (man kann nichts sicher wissen).`,
  takeaway: `Ciceros akademische Skepsis: Keine Schule kann die Existenz oder das Wesen der Götter zweifelsfrei beweisen. Dennoch ist die Volksreligion für den Staat notwendig. Ein brillantes Panorama der antiken Religionsphilosophie – und ein frühes Plädoyer für religiöse Toleranz und rationale Skepsis.`,
  structure: [
    {
      title: 'Buch I: Die epikureische Theologie',
      content: `Velleius trägt die epikureische Lehre vor: Die Götter existieren als glückliche, unsterbliche Wesen in den Intermundien (Zwischenwelträumen). Sie kümmern sich nicht um die Menschen oder die Welt, denn das würde ihre Glückseligkeit stören. Der Stoiker Cotta widerlegt diese Position: Eine Gottheit, die sich nicht um die Welt kümmert, ist keine Gottheit.`
    },
    {
      title: 'Buch II: Die stoische Theologie',
      content: `Der Stoiker Balbus trägt die Gegenposition vor: Die Welt ist von der göttlichen Vernunft (Logos) durchdrungen. Der Kosmos ist ein beseeltes, vernünftiges Wesen. Die Ordnung der Gestirne, die Zweckmäßigkeit der Natur und der allgemeine Götterglaube beweisen die Existenz einer göttlichen Vorsorge (providentia).`
    },
    {
      title: 'Buch III: Die akademische Kritik',
      content: `Cotta, der akademische Skeptiker, zerpflückt beide Positionen: Die stoischen Gottesbeweise sind nicht zwingend. Wenn es Übel in der Welt gibt, kann es keine allmächtige, gütige Gottheit geben. Cotta endet mit Agnostizismus. Cicero selbst bleibt unentschieden – die beste Haltung ist respektvolle Skepsis.`
    }
  ],
  translations: {}
};
export default work;
