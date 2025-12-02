// BEISPIEL: Werk mit Übersetzungen
// Diese Datei zeigt, wie ein Werk vollständig übersetzt werden kann

import { Work } from '@/types/blog';

const work: Work = {
  title: 'De Bello Gallico',
  author: 'caesar',
  year: 'ca. 58-49 v. Chr.',
  summary: 'Caesars berühmter Bericht über seine neun Jahre dauernden Feldzüge zur Eroberung Galliens. Es ist nicht nur eine militärische Chronik, sondern auch ein Meisterwerk politischer Selbstdarstellung, das Caesars Erfolge dem römischen Volk präsentieren sollte. Das Werk bietet detaillierte ethnografische Einblicke in die gallischen und germanischen Stämme.',
  takeaway: 'Römische Disziplin und strategisches Genie können jede Barbarenarmee besiegen. Gallien ist befriedet und nun Teil des Römischen Reiches.',
  structure: [
    { 
      title: 'Buch 1', 
      content: 'Krieg gegen die Helvetier und den Germanenfürsten Ariovist.' 
    },
    { 
      title: 'Buch 2', 
      content: 'Unterwerfung der belgischen Stämme.' 
    },
    { 
      title: 'Buch 3', 
      content: 'Kämpfe gegen die Veneter und andere Küstenvölker.' 
    },
    { 
      title: 'Buch 4', 
      content: 'Erste Rheinüberquerung und erste Expedition nach Britannien.' 
    },
    { 
      title: 'Buch 5', 
      content: 'Zweite Britannien-Expedition und Aufstände in Gallien.' 
    },
    { 
      title: 'Buch 6', 
      content: 'Zweite Rheinüberquerung und Beschreibung der Sitten der Gallier und Germanen.' 
    },
    { 
      title: 'Buch 7', 
      content: 'Der große gallische Aufstand unter Vercingetorix und die Belagerung von Alesia.' 
    },
    { 
      title: 'Buch 8', 
      content: 'Letzte Operationen und die vollständige Befriedung Galliens (vermutlich von Aulus Hirtius geschrieben).' 
    }
  ],
  translations: {
    de: {
      title: 'De Bello Gallico',
      summary: 'Caesars berühmter Bericht über seine neun Jahre dauernden Feldzüge zur Eroberung Galliens. Es ist nicht nur eine militärische Chronik, sondern auch ein Meisterwerk politischer Selbstdarstellung, das Caesars Erfolge dem römischen Volk präsentieren sollte. Das Werk bietet detaillierte ethnografische Einblicke in die gallischen und germanischen Stämme.',
      takeaway: 'Römische Disziplin und strategisches Genie können jede Barbarenarmee besiegen. Gallien ist befriedet und nun Teil des Römischen Reiches.',
      structure: [
        { title: 'Buch 1', content: 'Krieg gegen die Helvetier und den Germanenfürsten Ariovist.' },
        { title: 'Buch 2', content: 'Unterwerfung der belgischen Stämme.' },
        { title: 'Buch 3', content: 'Kämpfe gegen die Veneter und andere Küstenvölker.' },
        { title: 'Buch 4', content: 'Erste Rheinüberquerung und erste Expedition nach Britannien.' },
        { title: 'Buch 5', content: 'Zweite Britannien-Expedition und Aufstände in Gallien.' },
        { title: 'Buch 6', content: 'Zweite Rheinüberquerung und Beschreibung der Sitten der Gallier und Germanen.' },
        { title: 'Buch 7', content: 'Der große gallische Aufstand unter Vercingetorix und die Belagerung von Alesia.' },
        { title: 'Buch 8', content: 'Letzte Operationen und die vollständige Befriedung Galliens (vermutlich von Aulus Hirtius geschrieben).' }
      ]
    },
    en: {
      title: 'The Gallic Wars',
      summary: "Caesar's famous account of his nine-year campaigns to conquer Gaul. It is not only a military chronicle, but also a masterpiece of political self-presentation intended to showcase Caesar's successes to the Roman people. The work offers detailed ethnographic insights into the Gallic and Germanic tribes.",
      takeaway: 'Roman discipline and strategic genius can defeat any barbarian army. Gaul is pacified and now part of the Roman Empire.',
      structure: [
        { title: 'Book 1', content: 'War against the Helvetii and the Germanic prince Ariovistus.' },
        { title: 'Book 2', content: 'Subjugation of the Belgian tribes.' },
        { title: 'Book 3', content: 'Battles against the Veneti and other coastal peoples.' },
        { title: 'Book 4', content: 'First crossing of the Rhine and first expedition to Britain.' },
        { title: 'Book 5', content: 'Second Britain expedition and uprisings in Gaul.' },
        { title: 'Book 6', content: 'Second Rhine crossing and description of Gallic and Germanic customs.' },
        { title: 'Book 7', content: 'The great Gallic uprising under Vercingetorix and the siege of Alesia.' },
        { title: 'Book 8', content: 'Final operations and complete pacification of Gaul (probably written by Aulus Hirtius).' }
      ]
    },
    la: {
      title: 'De Bello Gallico',
      summary: 'Commentarius Caesaris celeberrimus de expeditionibus novem annorum ad Galliam debellandam. Non modo narratio militaris est, sed etiam opus perfectum demonstrationis politicae, quo Caesar successus suos populo Romano ostendere volebat. Opus prospectus ethnographicos accuratos de tribubus Gallicis et Germanicis praebet.',
      takeaway: 'Disciplina Romana et ingenium strategicum quamlibet barbarorum aciem vincere possunt. Gallia pacata est et nunc pars Imperii Romani.',
      structure: [
        { title: 'Liber I', content: 'Bellum contra Helvetios et principem Germanorum Ariovistum.' },
        { title: 'Liber II', content: 'Subactio tribuum Belgicarum.' },
        { title: 'Liber III', content: 'Proelia contra Venetos et alios populos maritimos.' },
        { title: 'Liber IV', content: 'Primus transitus Rheni et prima expeditio in Britanniam.' },
        { title: 'Liber V', content: 'Secunda expeditio Britannica et seditiones in Gallia.' },
        { title: 'Liber VI', content: 'Secundus transitus Rheni et descriptio morum Gallorum et Germanorum.' },
        { title: 'Liber VII', content: 'Magna seditio Gallica sub Vercingetorige et obsidio Alesiae.' },
        { title: 'Liber VIII', content: 'Operationes ultimae et pacificatio completa Galliae (probabiliter ab Aulo Hirtio scriptus).' }
      ]
    }
  }
};

export default work;

/*
  Um dieses Werk in works.ts zu verwenden, ersetze einfach die entsprechende Import-Zeile
  und das Werk wird automatisch mit Übersetzungen geladen.
  
  Die Übersetzungsfunktion getTranslatedWork() in translator.ts
  wird automatisch die richtige Sprachversion auswählen.
*/
