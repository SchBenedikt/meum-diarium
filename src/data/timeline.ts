import { TimelineEvent } from '@/types/blog';

export const timelineEvents: TimelineEvent[] = [
  // Births
  { year: -106, title: 'Geburt Ciceros', description: 'Marcus Tullius Cicero wird in Arpinum geboren', author: 'cicero', type: 'birth' },
  { year: -100, title: 'Geburt Caesars', description: 'Gaius Iulius Caesar wird in Rom geboren', author: 'caesar', type: 'birth' },
  { year: -63, title: 'Geburt des Augustus', description: 'Als Gaius Octavius in Rom geboren', author: 'augustus', type: 'birth' },
  { year: -4, title: 'Geburt Senecas', description: 'Lucius Annaeus Seneca wird in Córdoba geboren', author: 'seneca', type: 'birth' },

  // Early Career
  { year: -81, title: 'Ciceros erste Rede', description: 'Pro Quinctio – Ciceros erste erhaltene Rede', author: 'cicero', type: 'event' },
  { year: -75, title: 'Caesar wird gefangen', description: 'Von Piraten entführt und freigekauft', author: 'caesar', type: 'event' },
  { year: -73, title: 'Spartacus-Aufstand', description: 'Der größte Sklavenaufstand beginnt', author: 'caesar', type: 'event' },
  { year: -70, title: 'Cicero gegen Verres', description: 'Die berühmten Reden gegen Verres', author: 'cicero', type: 'event' },

  // Major Political Events
  { year: -63, title: 'Catilinarische Verschwörung', description: 'Cicero deckt die Verschwörung auf und rettet die Republik', author: 'cicero', type: 'event' },
  { year: -60, title: 'Erstes Triumvirat', description: 'Caesar, Pompeius und Crassus bilden ein Bündnis', author: 'caesar', type: 'event' },
  { year: -58, title: 'Beginn des Gallischen Krieges', description: 'Caesar beginnt die Eroberung Galliens', author: 'caesar', type: 'event' },
  { year: -55, title: 'Caesar überquert den Rhein', description: 'Erste römische Rheinüberquerung', author: 'caesar', type: 'event' },
  { year: -54, title: 'Invasion Britanniens', description: 'Caesar landet in Britannien', author: 'caesar', type: 'event' },
  { year: -52, title: 'Schlacht bei Alesia', description: 'Vercingetorix kapituliert – Ende des gallischen Widerstands', author: 'caesar', type: 'event' },
  { year: -49, title: 'Überschreitung des Rubikon', description: 'Alea iacta est – Der Bürgerkrieg beginnt', author: 'caesar', type: 'event' },
  { year: -48, title: 'Schlacht bei Pharsalos', description: 'Caesar besiegt Pompeius entscheidend', author: 'caesar', type: 'event' },
  { year: -47, title: 'Veni, vidi, vici', description: 'Caesars Sieg über Pharnakes II.', author: 'caesar', type: 'event' },
  { year: -45, title: 'Schlacht bei Munda', description: 'Caesars letzter militärischer Sieg', author: 'caesar', type: 'event' },
  { year: -44, title: 'Ermordung Caesars', description: 'An den Iden des März im Senat ermordet', author: 'caesar', type: 'death' },
  { year: -43, title: 'Tod Ciceros', description: 'Proskribiert und auf Befehl des Antonius getötet', author: 'cicero', type: 'death' },

  // Augustus Era
  { year: -42, title: 'Schlacht bei Philippi', description: 'Octavian und Antonius besiegen die Caesarmörder', author: 'augustus', type: 'event' },
  { year: -31, title: 'Schlacht bei Actium', description: 'Octavian besiegt Antonius und Kleopatra', author: 'augustus', type: 'event' },
  { year: -27, title: 'Beginn des Prinzipats', description: 'Octavian erhält den Titel Augustus', author: 'augustus', type: 'event' },
  { year: -19, title: 'Ara Pacis', description: 'Der Friedensaltar wird geweiht', author: 'augustus', type: 'event' },
  { year: 9, title: 'Varusschlacht', description: 'Vernichtende Niederlage der Römer in Germanien', author: 'augustus', type: 'event' },
  { year: 14, title: 'Tod des Augustus', description: 'Augustus stirbt in Nola', author: 'augustus', type: 'death' },

  // Seneca Era
  { year: 41, title: 'Senecas Verbannung', description: 'Nach Korsika verbannt durch Claudius', author: 'seneca', type: 'event' },
  { year: 49, title: 'Rückkehr nach Rom', description: 'Seneca wird aus der Verbannung zurückgerufen', author: 'seneca', type: 'event' },
  { year: 54, title: 'Seneca wird Neros Berater', description: 'Beginn des Quinquennium Neronis', author: 'seneca', type: 'event' },
  { year: 59, title: 'Mord an Agrippina', description: 'Nero lässt seine Mutter töten', author: 'seneca', type: 'event' },
  { year: 62, title: 'Senecas Rückzug', description: 'Seneca zieht sich aus der Politik zurück', author: 'seneca', type: 'event' },
  { year: 65, title: 'Tod Senecas', description: 'Erzwungener Selbstmord nach der Pisonischen Verschwörung', author: 'seneca', type: 'death' },

  // Works
  { year: -54, title: 'De Re Publica', description: 'Cicero schreibt sein Werk über den idealen Staat', author: 'cicero', type: 'work' },
  { year: -51, title: 'De Legibus', description: 'Ciceros Werk über die Gesetze', author: 'cicero', type: 'work' },
  { year: -45, title: 'Tusculanae Disputationes', description: 'Philosophische Gespräche in Tusculum', author: 'cicero', type: 'work' },
  { year: -44, title: 'De Officiis', description: 'Ciceros Werk über die Pflichten', author: 'cicero', type: 'work' },
  { year: 49, title: 'De Brevitate Vitae', description: 'Seneca über die Kürze des Lebens', author: 'seneca', type: 'work' },
  { year: 55, title: 'De Clementia', description: 'Senecas Werk über die Milde für Nero', author: 'seneca', type: 'work' },
  { year: 63, title: 'Epistulae Morales', description: 'Senecas philosophische Briefe an Lucilius', author: 'seneca', type: 'work' },
  { year: 14, title: 'Res Gestae', description: 'Augustus\' Rechenschaftsbericht über sein Leben', author: 'augustus', type: 'work' },
].sort((a, b) => a.year - b.year) as TimelineEvent[];
