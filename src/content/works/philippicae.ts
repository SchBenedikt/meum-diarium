import { Work } from '@/types/blog';
const work: Work = {
  title: 'Philippicae',
  author: 'cicero',
  year: '44–43 v. Chr.',
  summary: `Ciceros letzte verzweifelte Angriffe gegen Marcus Antonius nach Caesars Mord (44-43 v. Chr.). Vierzehn flammende Reden - Meisterwerke von Sarkasmus und Rhetorik. Kosteten Cicero sein Leben: Am 7. Dezember 43 v. Chr. ermordet, sein Kopf auf dem Forum zur Schau gestellt.`,
  takeaway: `Cicero überschätzte die Kraft der Worte und unterschätzte die Macht der Waffen. Sein Vertrauen in Octavian war Selbstmord. Dennoch starb er für seine Prinzipien. Ein Testament für einen Mann, der die Republik mehr liebte als sein Leben.`,
  structure: [
    { 
      title: 'Philippica I (2. September 44 v. Chr.)', 
      content: `Die erste Rede ist noch relativ gemäßigt - ein tastender Angriff auf Antonius' Politik, nicht seine Person. 
Kontext:
Nach Caesars Tod übernahm Antonius faktisch die Macht in Rom.  Er behauptete, Caesars Erbe zu verwalten, nutzte aber gefälschte "Dekrete" Caesars, um eigene Macht auszubauen.` 
    },
    { 
      title: 'Philippica II (geschrieben Okt. 44, nie gehalten)', 
      content: `Die berühmteste der Philippischen Reden - eine vernichtende Invektive gegen Antonius' gesamtes Leben und Charakter.  Sie wurde nie öffentlich vorgetragen, sondern als Pamphlet verbreitet. 
Warum nicht gehalten?` 
    },
    { 
      title: 'Philippica III–XIV (Dez. 44 – April 43 v. Chr.)', 
      content: `Die restlichen zwölf Reden eskalierten den Konflikt zum offenen Bürgerkrieg. 
Philippica III & IV (Dezember 44):
Antonius hat Rom verlassen und belagert Decimus Brutus (einen der Caesarmörder) in Mutina (Modena).  Cicero fordert den Senat auf, Antonius zum Staatsfeind zu erklären.` 
    }
  ],
  translations: {}
};
export default work;
