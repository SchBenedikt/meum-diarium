import { Work } from '@/types/blog';
const work: Work = {
  title: 'De Bello Gallico',
  author: 'caesar',
  year: '58-50 v. Chr.',
  summary: `Caesars Bericht über die Eroberung Galliens (58-50 v. Chr.). Ein Meisterwerk der Kriegsberichterstattung und politischen Propaganda in kristallklarer Prosa. Das Werk prägt bis heute den Lateinunterricht mit seinem berühmten Eröffnungssatz: "Gallia est omnis divisa in partes tres".`,
  takeaway: `Rechtfertigung einer Eroberung als Notwendigkeit. Caesar präsentiert die Unterwerfung Galliens als defensive Maßnahme zum Schutz Roms. Ein Meisterwerk der Geschichtsschreibung durch den Sieger: brutale Realität, elegant verpackt als zivilisatorische Mission.`,
  structure: [
    { 
      title: 'Buch I (58 v. Chr.)', 
      content: `Der Helvetierkrieg eröffnet Caesars Feldzüge.  Die Helvetier, ein keltischer Stamm, planen die Auswanderung aus ihrem angestammten Gebiet (heutige Schweiz) durch römisches Territorium.  Caesar verhindert dies zunächst diplomatisch, dann militärisch.` 
    },
    { 
      title: 'Buch II (57 v. Chr.)', 
      content: `Die Unterwerfung der Belgier im Nordosten Galliens.  Die belgischen Stämme, alarmiert durch Caesars Erfolge, bilden eine Koalition gegen Rom.  Caesar führt präventive Angriffe durch und besiegt die Nervier in einer dramatischen Schlacht, in der er selbst zum Schwert greifen muss.` 
    },
    { 
      title: 'Buch III (56 v. Chr.)', 
      content: `Feldzüge an der Atlantikküste gegen die Veneter, ein seefahrendes Volk in der Bretagne.  Caesar lässt eine Flotte bauen und besiegt die Veneter in einer Seeschlacht - eine bemerkenswerte Leistung für die eigentlich landgebundenen Römer.  Die Veneter werden exemplarisch bestraft: Die Führung wird hingerichtet, die Bevölkerung versklavt.` 
    },
    { 
      title: 'Buch IV (55 v. Chr.)', 
      content: `Caesars spektakuläre Propaganda-Aktionen: der erste Rheinübergang und die erste Expedition nach Britannien.  Caesar lässt in nur zehn Tagen eine Brücke über den Rhein bauen - eine technische Meisterleistung, die Germanen und Römer gleichermaßen beeindruckt.  Der kurze Feldzug jenseits des Rheins dient vor allem der Demonstration römischer Macht.` 
    },
    { 
      title: 'Buch V (54 v. Chr.)', 
      content: `Die zweite, besser vorbereitete Britannien-Expedition mit fünf Legionen.  Caesar überquert die Themse und besiegt den britannischen König Cassivellaunus, kann aber keine dauerhafte Kontrolle etablieren.  Die Britannien-Expeditionen bringen mehr Ruhm als realen Gewinn.` 
    },
    { 
      title: 'Buch VI (53 v. Chr.)', 
      content: `Der zweite Rheinübergang und Strafexpeditionen gegen aufständische Stämme.  Das Buch enthält berühmte ethnographische Exkurse über gallische und germanische Sitten, Religion und Gesellschaft - wertvolle Quellen für die moderne Forschung. 
Caesar beschreibt das keltische Druidentum, die Rolle der Adelsklasse, Opferbräuche und Stammesstrukturen.` 
    },
    { 
      title: 'Buch VII (52 v. Chr.)', 
      content: `Der Höhepunkt des Werkes: Der große gallische Aufstand unter Vercingetorix.  Ein charismatischer Arvernerfürst einigt die gallischen Stämme zu einem koordinierten Widerstand.  Vercingetorix wendet eine Taktik der verbrannten Erde an und vermeidet offene Feldschlachten.` 
    },
    { 
      title: 'Buch VIII (51-50 v. Chr.)', 
      content: `Von Aulus Hirtius verfasst, um Caesars Kommentare zu vervollständigen.  Das Buch beschreibt die endgültige Pazifizierung Galliens nach Vercingetorix' Niederlage.  Letzte Aufstände werden niedergeschlagen, insbesondere in Uxellodunum, wo Caesar den Verteidigern exemplarisch die Hände abhacken lässt.` 
    }
  ],
  translations: {
    de: {
      title: 'De Bello Gallico',
      summary: 'Caesars Bericht über die Eroberung Galliens (58-50 v. Chr.). Ein Meisterwerk der Kriegsberichterstattung und politischen Propaganda in kristallklarer Prosa.',
      takeaway: 'Rechtfertigung einer Eroberung als Notwendigkeit. Caesar präsentiert die Unterwerfung Galliens als defensive Maßnahme zum Schutz Roms.',
      structure: [
        { title: 'Buch I (58 v. Chr.)', content: 'Der Helvetierkrieg eröffnet Caesars Feldzüge.' },
        { title: 'Buch II (57 v. Chr.)', content: 'Die Unterwerfung der Belgier im Nordosten Galliens.' },
        { title: 'Buch III (56 v. Chr.)', content: 'Feldzüge an der Atlantikküste gegen die Veneter.' },
        { title: 'Buch IV (55 v. Chr.)', content: 'Caesars spektakuläre Propaganda-Aktionen: der erste Rheinübergang und die erste Expedition nach Britannien.' },
        { title: 'Buch V (54 v. Chr.)', content: 'Die zweite, besser vorbereitete Britannien-Expedition mit fünf Legionen.' },
        { title: 'Buch VI (53 v. Chr.)', content: 'Der zweite Rheinübergang und Strafexpeditionen gegen aufständische Stämme.' },
        { title: 'Buch VII (52 v. Chr.)', content: 'Der Höhepunkt des Werkes: Der große gallische Aufstand unter Vercingetorix.' },
        { title: 'Buch VIII (51-50 v. Chr.)', content: 'Von Aulus Hirtius verfasst, um Caesars Kommentare zu vervollständigen.' }
      ]
    },
    en: {
      title: 'Commentary on the Gallic War',
      summary: 'Caesar\'s account of the conquest of Gaul (58-50 BC). A masterpiece of war reporting and political propaganda in crystal-clear prose.',
      takeaway: 'Justification of a conquest as necessity. Caesar presents the subjugation of Gaul as a defensive measure to protect Rome.',
      structure: [
        { title: 'Book I (58 BC)', content: 'The Helvetian War begins Caesar\'s campaigns.' },
        { title: 'Book II (57 BC)', content: 'The subjugation of the Belgae in northeastern Gaul.' },
        { title: 'Book III (56 BC)', content: 'Campaigns on the Atlantic coast against the Veneti.' },
        { title: 'Book IV (55 BC)', content: 'Caesar\'s spectacular propaganda actions: the first Rhine crossing and the first expedition to Britain.' },
        { title: 'Book V (54 BC)', content: 'The second, better-prepared British expedition with five legions.' },
        { title: 'Book VI (53 BC)', content: 'The second Rhine crossing and punitive expeditions against rebellious tribes.' },
        { title: 'Book VII (52 BC)', content: 'The climax of the work: The great Gallic revolt under Vercingetorix.' },
        { title: 'Book VIII (51-50 BC)', content: 'Written by Aulus Hirtius to complete Caesar\'s commentaries.' }
      ]
    },
    la: {
      title: 'De Bello Gallico',
      summary: 'Commentarius Caesaris de Galliae expugnatione (58-50 a.C.n.). Magistrum bellorum nuntiorum et politicae propaganda perspicua oratione.',
      takeaway: 'Expugnationis necessitatis defensio. Caesar Galliae subiectionem ut mensuram defensivam ad Romam protegendam praesentat.',
      structure: [
        { title: 'Liber I (58 a.C.n.)', content: 'Bellum Helveticum Caesaris expeditiones initiat.' },
        { title: 'Liber II (57 a.C.n.)', content: 'Belgarum subiectio in Gallia septentrionali-orientali.' },
        { title: 'Liber III (56 a.C.n.)', content: 'Expeditiones litore Atlantico contra Venetos.' },
        { title: 'Liber IV (55 a.C.n.)', content: 'Caesaris spectacula propagandistica: primum Rhenum transgressum et primam expeditionem in Britanniam.' },
        { title: 'Liber V (54 a.C.n.)', content: 'Secunda, melius parata Britannica expeditio cum quinque legionibus.' },
        { title: 'Liber VI (53 a.C.n.)', content: 'Secundum Rhenum transgressum et expeditiones punitivas contra tribus rebellantes.' },
        { title: 'Liber VII (52 a.C.n.)', content: 'Culmen operis: Magna Gallica rebellio sub Vercingetorige.' },
        { title: 'Liber VIII (51-50 a.C.n.)', content: 'Aulo Hirtio scriptum ut Caesaris commentarios compleat.' }
      ]
    }
  }
};
export default work;
