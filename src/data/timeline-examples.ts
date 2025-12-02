// BEISPIEL: Timeline-Event mit Übersetzungen
// Diese Datei zeigt, wie Timeline-Events übersetzt werden können

import { TimelineEvent } from '@/types/blog';

// Beispiel 1: Catilinarische Verschwörung
export const catilinarischeVerschwörung: TimelineEvent = {
  year: -63,
  title: 'Catilinarische Verschwörung',
  description: 'Cicero deckt die Verschwörung auf und rettet die Republik',
  author: 'cicero',
  type: 'event',
  translations: {
    de: {
      title: 'Catilinarische Verschwörung',
      description: 'Cicero deckt die Verschwörung auf und rettet die Republik'
    },
    en: {
      title: 'Catiline Conspiracy',
      description: 'Cicero uncovers the conspiracy and saves the Republic'
    },
    la: {
      title: 'Coniuratio Catilinae',
      description: 'Cicero coniurationem detexit et rem publicam servavit'
    }
  }
};

// Beispiel 2: Schlacht bei Alesia
export const schlachtBeiAlesia: TimelineEvent = {
  year: -52,
  title: 'Schlacht bei Alesia',
  description: 'Vercingetorix kapituliert – Ende des gallischen Widerstands',
  author: 'caesar',
  type: 'event',
  translations: {
    de: {
      title: 'Schlacht bei Alesia',
      description: 'Vercingetorix kapituliert – Ende des gallischen Widerstands'
    },
    en: {
      title: 'Battle of Alesia',
      description: 'Vercingetorix surrenders – End of Gallic resistance'
    },
    la: {
      title: 'Proelium Alesiae',
      description: 'Vercingetorix se dedit – Finis resistentiae Gallicae'
    }
  }
};

// Beispiel 3: Überschreitung des Rubikon
export const rubikon: TimelineEvent = {
  year: -49,
  title: 'Überschreitung des Rubikon',
  description: 'Alea iacta est – Der Bürgerkrieg beginnt',
  author: 'caesar',
  type: 'event',
  translations: {
    de: {
      title: 'Überschreitung des Rubikon',
      description: 'Alea iacta est – Der Bürgerkrieg beginnt'
    },
    en: {
      title: 'Crossing of the Rubicon',
      description: 'Alea iacta est – The Civil War begins'
    },
    la: {
      title: 'Transitus Rubiconis',
      description: 'Alea iacta est – Bellum civile incipit'
    }
  }
};

// Beispiel 4: Schlacht bei Actium
export const actium: TimelineEvent = {
  year: -31,
  title: 'Schlacht bei Actium',
  description: 'Octavian besiegt Antonius und Kleopatra',
  author: 'augustus',
  type: 'event',
  translations: {
    de: {
      title: 'Schlacht bei Actium',
      description: 'Octavian besiegt Antonius und Kleopatra'
    },
    en: {
      title: 'Battle of Actium',
      description: 'Octavian defeats Antonius and Cleopatra'
    },
    la: {
      title: 'Proelium Actiacum',
      description: 'Octavianus Antonium et Cleopatram vicit'
    }
  }
};

// Beispiel 5: Geburt
export const geburtCicero: TimelineEvent = {
  year: -106,
  title: 'Geburt Ciceros',
  description: 'Marcus Tullius Cicero wird in Arpinum geboren',
  author: 'cicero',
  type: 'birth',
  translations: {
    de: {
      title: 'Geburt Ciceros',
      description: 'Marcus Tullius Cicero wird in Arpinum geboren'
    },
    en: {
      title: 'Birth of Cicero',
      description: 'Marcus Tullius Cicero is born in Arpinum'
    },
    la: {
      title: 'Natus Ciceronis',
      description: 'Marcus Tullius Cicero Arpini nascitur'
    }
  }
};

/*
  Um diese in timeline.ts zu verwenden:
  
  import { catilinarischeVerschwörung, schlachtBeiAlesia, ... } from './timeline-examples';
  
  export const timelineEvents: TimelineEvent[] = [
    catilinarischeVerschwörung,
    schlachtBeiAlesia,
    rubikon,
    actium,
    geburtCicero,
    // ... weitere Events
  ];
*/
