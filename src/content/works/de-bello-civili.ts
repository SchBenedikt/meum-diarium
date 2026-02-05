import { Work } from '@/types/blog';
const work: Work = {
  title: 'De Bello Civili',
  author: 'caesar',
  year: '49-48 v. Chr.',
  summary: `Caesars Bericht über den Bürgerkrieg gegen Pompeius (49-48 v. Chr.). Emotionaler und defensiver als De Bello Gallico. Caesar rechtfertigt die Überschreitung des Rubikon als Selbstverteidigung gegen eine illegale senatorische Clique - ein Meisterwerk der politischen Selbstrechtfertigung.`,
  takeaway: `Ein hochintelligenter Diktator rechtfertigt seine Machtergreifung als unvermeidbare Notwendigkeit. Caesar stellt sich als Opfer dar, der gezwungen wurde zu handeln. Die militärischen Schilderungen sind brillant, aber die politischen Argumente sind durchsichtig selbstrechtfertigend.`,
  structure: [
    { 
      title: 'Buch I (Januar-April 49 v. Chr.)', 
      content: `Das dramatische erste Buch beginnt mit den politischen Ereignissen in Rom Ende 50/Anfang 49 v.  Chr.  Der Senat, unter Druck von Caesars Feinden, verlangt, dass Caesar seine Legionen auflöst und als Privatmann nach Rom zurückkehrt - was seiner politischen Vernichtung gleichgekommen wäre.` 
    },
    { 
      title: 'Buch II (April-August 49 v. Chr.)', 
      content: `Das zweite Buch konzentriert sich auf die Feldzüge in Spanien und die Belagerung von Massilia.  Caesar selbst nimmt nicht an allen geschilderten Ereignissen teil - teilweise verlässt er sich auf Berichte seiner Legaten. 
In Spanien stehen Pompeius' erfahrene Legaten Afranius und Petreius mit mehreren Legionen.` 
    },
    { 
      title: 'Buch III (Januar-Herbst 48 v. Chr.)', 
      content: `Das dramatische dritte Buch schildert die Entscheidungsschlacht bei Pharsalos und ihre Folgen.  Caesar setzt mit seinen Legionen nach Griechenland über, wo Pompeius mit einer numerisch überlegenen Armee wartet.  Die Ausgangssituation ist für Caesar prekär: Pompeius kontrolliert die See, verfügt über mehr Truppen und kann Caesar aushungern.` 
    }
  ],
  translations: {}
};
export default work;
