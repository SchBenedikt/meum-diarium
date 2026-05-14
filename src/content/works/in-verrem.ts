import { Work } from '@/types/blog';
const work: Work = {
  title: 'In Verrem',
  author: 'cicero',
  year: '70 v. Chr.',
  summary: `In Verrem (Gegen Verres) ist Ciceros erste große Rede als Ankläger. Gaius Verres, der korrupte Statthalter Siziliens, wurde der Erpressung, Plünderung und Rechtsbeugung angeklagt. Cicero sammelte in nur 50 Tagen überwältigendes Beweismaterial. Die Anklage war so vernichtend, dass Verres ins Exil floh, noch bevor die Verhandlung abgeschlossen war.`,
  takeaway: `Die erste Rede zeigte die ganze Macht der römischen Rhetorik. Cicero besiegte nicht nur Verres, sondern auch den berühmtesten Anwalt der Zeit, Hortensius. Der Fall etablierte Ciceros Ruf als furchtloser Anwalt der Provinzialen gegen die Willkür der Macht.`,
  structure: [
    {
      title: 'Divinatio in Q. Caecilium',
      content: `Vorspiel: Caecilius Niger, ein anderer Ankläger, beansprucht das Anklagerecht für sich. Cicero widerlegt Caecilius' Anspruch und gewinnt das Recht zur Anklage.`
    },
    {
      title: 'Actio I: Die erste Verhandlung',
      content: `Ciceros Eröffnungsrede: Er kündigt an, nicht durch lange Reden, sondern durch Beweise und Zeugen zu überführen. Verres' Anwalt Hortensius bricht zusammen. Verres geht ins Exil.`
    },
    {
      title: 'Actio II: Die nicht gehaltene Anklage (Buch 1–5)',
      content: `Die fünf Bücher der ausgearbeiteten Anklage, die nie vorgetragen wurde, da Verres bereits geflohen war: I. Die Untaten als Stadtprätor in Rom, II. Die Plünderung Siziliens, III. Die Getreideerpressung, IV. Der Kunstraub (berühmte Beschreibung der geraubten Kunstschätze), V. Die Justizverbrechen und Hinrichtungen römischer Bürger.`
    }
  ],
  translations: {}
};
export default work;
