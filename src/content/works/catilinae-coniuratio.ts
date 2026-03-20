import { Work } from '@/types/blog';

const work: Work = {
  title: 'Catilinae Coniuratio',
  author: 'catilina',
  year: '63 v. Chr.',
  slug: 'catilinae-coniuratio',
  summary: `Die Catilinarische Verschwörung. Lucius Sergius Catilinas gescheiterter Staatsstreich gegen die Römische Republik. Ein dramatisches Kapitel der späten Republik, das Ciceros berühmte Reden auslöste.`,
  takeaway: `Ein gescheiterter Staatsstreich, der die Republik erschütterte. Catilinas Versuch, durch Mord und Brandstiftung an die Macht zu kommen, zeigt die Krisenanfälligkeit der späten Republik. Seine Niederlage stärkte Ciceros Position, führte aber auch zu dessen späterem Sturz.`,
  structure: [
    {
      title: 'Die politische Situation',
      content: `Rom 63 v. Chr.: Tiefe politische Krise. Schuldenkrise, soziale Unruhen, Konflikte zwischen Optimaten und Popularen. Catilina als Anführer der verschuldeten Landbevölkerung.`
    },
    {
      title: 'Die Verschwörungspläne',
      content: `Drei Phasen des Anschlags: 1. Ermordung der Konsuln, 2. Brandstiftung in Rom, 3. Erhebung zum Diktator. Einbeziehung von Senatoren, Rittern und ausländischen Kräften.`
    },
    {
      title: 'Ciceros Entdeckung und Reaktion',
      content: `Die vier Catilinarischen Reden. Erste Enthüllung im Senat, Steigerung der Anklagen, Verhaftung der Verschwörer in Rom, Catilinas Flucht und Niederlage bei Pistoria.`
    },
    {
      title: 'Die Niederlage und Folgen',
      content: `Catilinas Tod in der Schlacht bei Pistoria. Hinrichtung der in Rom gefangenen Verschwörer ohne Gerichtsverfahren. Ciceros Triumph und späterer Sturz wegen der Hinrichtungen.`
    }
  ]
};

export default work;
