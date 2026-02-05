import { Work } from '@/types/blog';
const work: Work = {
  title: 'De Re Publica',
  author: 'cicero',
  year: '54–51 v. Chr.',
  summary: `Ciceros Verteidigung der idealen Republik als Dialog. Argumentiert für die gemischte Verfassung (Monarchie + Aristokratie + Demokratie), die Roms Verfassung verkörpert. Viel fragmentarisch erhalten; das berühmte "Somnium Scipionis" inspirierte das Mittelalter.`,
  takeaway: `Ein verzweifelter Verteidigungsschrift für die untergehende Republik. Cicero warnt vor Demagogie und Diktatur - Ironie: verfasst genau als Caesar an die Macht kommt. Das "Somnium Scipionis" schuf das mittelalterliche Ideal der Unsterblichkeit durch Staatsdienst.`,
  structure: [
    { 
      title: 'Buch I–II: Definition des Staates', 
      content: `Cicero beginnt mit grundlegenden Fragen: Was ist ein Staat?  Warum leben Menschen in politischen Gemeinschaften? 
Definition: "Res publica est res populi" - Der Staat ist die Sache des Volkes.` 
    },
    { 
      title: 'Buch III: Gerechtigkeit im Staat', 
      content: `Dieses Buch ist am stärksten fragmentiert, aber seine zentrale These ist rekonstruierbar: Ohne Gerechtigkeit gibt es keinen wahren Staat. 
Der Philosoph Philus wird beauftragt, die Position zu vertreten, dass Ungerechtigkeit für Staaten vorteilhaft sein kann (die Position des Sophisten Karneades).  Dann widerlegt Laelius diese Position und verteidigt die Naturrechtslehre.` 
    },
    { 
      title: 'Buch IV–V: Der ideale Staatsmann', 
      content: `Diese Bücher sind stark fragmentiert, behandeln aber Erziehung, Kultur und die Eigenschaften des idealen rector rei publicae (Lenker des Staates). 
Themen:
- Bildung des Staatsmannes: Rhetorik, Philosophie, Geschichte, Recht
- Kulturpolitik: Theater, Spiele und ihre Rolle in der Gesellschaft (Cicero ist skeptisch gegenüber exzessiven Vergnügungen)
- Die Rolle der Religion im Staat: Notwendig für soziale Ordnung
- Wirtschaftspolitik und die Verteilung von Land
Cicero argumentiert, dass der ideale Staatsmann nicht nur politisch kompetent sein muss, sondern auch moralisch integer.  Er muss philosophische Bildung mit praktischer Erfahrung verbinden - genau das Ideal, dem Cicero selbst nachstrebte (und das er in sich selbst verkörpert sah).` 
    },
    { 
      title: 'Buch VI: Somnium Scipionis', 
      content: `Der berühmte "Traum des Scipio" ist der einzige vollständig erhaltene Teil des Werkes.  Er bietet einen philosophischen und kosmischen Rahmen für die politische Ethik. 
Die Vision:
Scipio Aemilianus (der jüngere) erzählt von einem Traum in Afrika.` 
    }
  ],
  translations: {}
};
export default work;
