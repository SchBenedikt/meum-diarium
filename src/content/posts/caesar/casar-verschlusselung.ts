import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '5',
  slug: 'casar-verschlusselung',
  author: 'caesar',
  title: 'Cäsar-Verschlüsselung',
  
  
  
  excerpt: '',
  historicalDate: '50 v. Chr.',
  historicalYear: -50,
  date: new Date().toISOString().split('T')[0],
  readingTime: 2,
    tags: ["Cäsar-Verschlüsselung","Cäsarchiffre"],
    tagsWithTranslations: [],
  coverImage: 'https://caesar.schächner.de/wp-content/uploads/2024/03/vehglvku4qq.jpg',
  content: {
    diary: `Der römische Geschichtsschreiber Sueton hat in seiner Biographie über mich folgende Passage überliefert: „[…] si qua occultius perferenda erant, per notas scripsit, id est sic structo litterarum ordine, ut nullum verbum effici posset: quae si quis investigare et persequi velit, quartam elementorum litteram, id est D pro A et perinde reliquas commutet." Diese Worte beschreiben eine Methode, die heute viele Namen trägt: Cäsarchiffre, Cäsar-Verschiebung, Caesar Shift, Cäsarverschlüsselung, Einfacher Cäsar oder schlicht Cäsar Code.

Als Feldherr steht man oft vor der Herausforderung, geheime militärische Pläne vor den Augen der Feinde zu schützen. Meine Gegner würden alles darum geben, meine Strategien zu kennen und meine Befehle abzufangen. Aus dieser Notwendigkeit heraus entwickelte ich eine Verschlüsselungsmethode, die ebenso einfach wie wirksam ist. Die Funktionsweise ist denkbar simpel: Jeder Buchstabe einer Nachricht wird im Alphabet um drei Positionen nach rechts verschoben. So wird aus einem A ein D, aus einem B ein E und so weiter. Um die Anwendung zu erleichtern, verwende ich in dieser Verschlüsselung ausschließlich Kleinbuchstaben.

Diese Methode erwies sich als so nützlich, dass sie auch nach mir noch Verwendung fand. Mein Großneffe und Nachfolger Augustus nutzte ein ähnliches Verfahren, allerdings mit einer Verschiebung um nur einen Buchstaben und ohne das Alphabet zu rotieren. Anstelle eines X, des letzten Buchstabens des damaligen lateinischen Alphabets, schrieb er AA.

Man mag nun denken, dies sei die sicherste aller Verschlüsselungen. Doch das Besondere an meiner Methode liegt nicht in ihrer Unknackbarkeit, sondern darin, dass die Entschlüsselungsmethode selbst geheim bleiben muss. Sobald der Gegner das Prinzip kennt, lässt sich die Verschlüsselung leicht brechen. Es existieren unzählige solcher Verschlüsselungsmethoden, doch eine Wahrheit bleibt: Entweder stammt eine Verschlüsselung von mir, von Cäsar, oder sie wurde mir gestohlen.

Zu dieser Verschlüsselung gibt es noch eine Anekdote aus meinem Leben. Als man mir kurz vor meiner Ermordung auf dem Weg zum Senat eine Warnung zusteckte, soll ich sie mit den Worten „Cras legam" – „Morgen werde ich es lesen" – sorglos zur Seite gelegt haben. Ein fataler Fehler, wie sich zeigen sollte.`,
    scientific: `## Die Cäsar-Verschlüsselung: Historische Genese, mathematische Prinzipien und kryptoanalytische Schwachstellen

Die Cäsar-Verschlüsselung, in der Fachliteratur auch als Cäsar-Chiffre oder Verschiebechiffre bezeichnet, stellt eines der fundamentalsten Verfahren der klassischen Kryptographie dar. Es handelt sich hierbei um ein symmetrisches Verschlüsselungsverfahren, das der Klasse der monoalphabetischen Substitutionen zugeordnet wird. Obwohl das Verfahren nach heutigen kryptographischen Standards als absolut unsicher gilt und keinerlei ernsthaften Schutz für vertrauliche Daten bietet, besitzt es eine enorme historische Relevanz und dient in der Kryptoedukation als elementares Einstiegsmodell, um die Grundprinzipien von Verschlüsselung und Kryptoanalyse zu demonstrieren.

## Historischer Kontext und antike Quellenlage

Der Namensgeber dieses Verfahrens ist der römische Staatsmann und Feldherr Gaius Julius Caesar (100 v. Chr. – 44 v. Chr.). Die primäre historische Quelle, die die Verwendung dieser Verschlüsselungsmethode belegt, ist das Werk *De Vita Caesarum* (Das Leben der Cäsaren) des römischen Biographen Gaius Suetonius Tranquillus. Suetonius beschreibt, dass Caesar dieses Verfahren nutzte, um militärische und politische Korrespondenz vor unbefugtem Zugriff zu schützen. Insbesondere während des Gallischen Krieges war die Geheimhaltung strategischer Befehle von essentieller Bedeutung.

Nach den Überlieferungen von Suetonius verwendete Caesar eine feste Verschiebung des Alphabets um drei Positionen. Ein Buchstabe im Klartext wurde also durch denjenigen Buchstaben ersetzt, der im Alphabet drei Stellen weiter hinten stand. Der Buchstabe A wurde zu D, B zu E und so weiter. Suetonius schreibt explizit: „Wenn er etwas Geheimes zu übermitteln hatte, schrieb er es in Zeichen, das heißt, indem er die Buchstaben so ordnete, dass kein Wort gelesen werden konnte. Wer diese entziffern und den Sinn verstehen wollte, musste den vierten Buchstaben des Alphabets, also D, für A einsetzen und so fortfahren.“

Interessanterweise berichtet Suetonius auch über Caesars Großneffen und Nachfolger Augustus, der ebenfalls eine Variante dieser Verschlüsselung nutzte. Augustus verwendete jedoch eine Verschiebung um lediglich eine Position (A zu B). Zudem unterschied sich sein Verfahren in der Behandlung des letzten Buchstaben des Alphabets: Während Caesar eine zyklische Rotation anwandte (X wurde zu A, Y zu B, Z zu C), schrieb Augustus für den letzten Buchstaben 'X' (das römische Alphabet endete damals oft vor Z, das erst später für griechische Fremdwörter fest integriert wurde) den Doppelbuchstaben 'AA'. Dies deutet darauf hin, dass das Konzept der modularen Arithmetik, das den Übertrag am Ende des Alphabets regelt, noch nicht vollständig abstrahiert war.

## Funktionsweise und algorithmische Struktur

Das Verfahren basiert auf dem Prinzip der monoalphabetischen Substitution. Dies bedeutet, dass jedes Zeichen des Klartextalphabets auf ein eindeutiges Zeichen des Geheimtextalphabets abgebildet wird. Die Zuordnung ist dabei über den gesamten Text hinweg konstant. Im Gegensatz zur polyalphabetischen Substitution (wie etwa der Vigenère-Verschlüsselung), bei der ein Buchstabe je nach Position im Text unterschiedlich verschlüsselt werden kann, bleibt bei der Cäsar-Chiffre die Beziehung zwischen Klartext- und Geheimtextzeichen starr.

Das Kernprinzip ist die zyklische Verschiebung (Rotation) des Alphabets um einen bestimmten Schlüssel \$k\$. Um dies mathematisch formal zu beschreiben, werden die Buchstaben des Alphabets zunächst auf den Zahlenraum abgebildet. Im Standardfall des lateinischen Alphabets mit 26 Buchstaben erfolgt die Zuordnung \$A \rightarrow 0, B \rightarrow 1, \dots, Z \rightarrow 25\$.

Die Verschlüsselungsfunktion \$E\$ für einen Klartextbuchstaben \$x\$ mit dem Schlüssel \$k\$ (der Verschiebedistanz) lässt sich mittels der Modulo-Arithmetik präzise definieren:

\$E_n(x) = (x + k) \mod 26\$

Hierbei ist \$x\$ der numerische Wert des Klartextbuchstabens und \$k\$ der numerische Wert der Verschiebung (bei der historischen Cäsar-Chiffre ist \$k=3\$). Der Operator \$\mod 26\$ stellt sicher, dass das Ergebnis im Bereich von 0 bis 25 bleibt. Erreicht die Addition einen Wert von 26 oder höher, beginnt die Zählung wieder am Anfang des Alphabets (aus Z wird bei \$k=1\$ wieder A).

Die Entschlüsselung \$D\$ erfolgt analog durch die Subtraktion des Schlüssels, also die Umkehrung der Verschiebung:

\$D_n(y) = (y - k) \mod 26\$

Sollte die Subtraktion einen negativen Wert ergeben, wird im Rahmen der Restklassenarithmetik 26 addiert, um wieder in den positiven Bereich des Rings \$\mathbb{Z}_{26}\$ zu gelangen. Ein anschauliches Hilfsmittel zur Durchführung dieser Operationen war in der Geschichte oft die sogenannte Cäsar-Scheibe, die aus zwei drehbaren, konzentrischen Scheiben bestand, auf denen jeweils das Alphabet verzeichnet war.

## Kryptoanalyse und Sicherheitsbewertung

Aus perspektivischer Sicht der modernen Kryptologie bietet die Cäsar-Verschlüsselung keinerlei Sicherheit. Die Gründe hierfür liegen in der extrem geringen Größe des Schlüsselraums und der Erhaltung der statistischen Eigenschaften der Sprache.

Ein Angreifer, der lediglich den Geheimtext besitzt und weiß, dass es sich um eine Verschiebechiffre handelt, kann das Verfahren durch einen "Brute-Force-Angriff" trivial brechen. Da das lateinische Alphabet nur 26 Buchstaben umfasst, existieren lediglich 25 sinnvolle Verschiebungen (eine Verschiebung um 0 oder 26 ändert den Text nicht). Ein Analyst muss also lediglich 25 Varianten ausprobieren, um den lesbaren Klartext zu finden. Dies ist selbst ohne Computerhilfe innerhalb weniger Minuten möglich.

Weitaus gravierender ist jedoch die Anfälligkeit gegenüber der Häufigkeitsanalyse. Da die Cäsar-Chiffre monoalphabetisch arbeitet, wird die Häufigkeitsverteilung der Buchstaben im Klartext direkt auf den Geheimtext übertragen. In jeder natürlichen Sprache treten bestimmte Buchstaben signifikant häufiger auf als andere. Im Deutschen ist das "E" der mit Abstand häufigste Buchstabe, gefolgt von "N", "I", "S" und "R". Im Englischen dominiert ebenfalls das "E", gefolgt von "T" und "A".

Ein Kryptoanalyst zählt die Vorkommen der Buchstaben im Chiffrat. Findet er beispielsweise heraus, dass der Buchstabe "H" im Geheimtext am häufigsten vorkommt, liegt die Vermutung nahe, dass das "H" das verschlüsselte "E" ist. Die Distanz zwischen E (Position 4) und H (Position 7) beträgt 3. Damit wäre der Schlüssel \$k=3\$ (die klassische Cäsar-Verschlüsselung) identifiziert. Diese Methode wurde bereits im 9. Jahrhundert vom arabischen Gelehrten Al-Kindi in seinem Werk über das Entziffern kryptographischer Botschaften beschrieben und markiert den historischen Wendepunkt, an dem einfache Substitutionsverfahren ihre Sicherheit verloren. Neben der Einzelbuchstabenhäufigkeit bleiben auch charakteristische Muster wie Bigramme (Buchstabenpaare) und Trigramme erhalten, was die Analyse weiter vereinfacht.

## Varianten und Weiterentwicklungen

Obwohl die reine Cäsar-Verschlüsselung obsolet ist, bildet sie die Basis für komplexere Verfahren. Eine bekannte Variante im Computerzeitalter ist ROT13. Hierbei wird das Alphabet um exakt 13 Stellen verschoben. Da \$13 + 13 = 26\$ ist, ist die Verschlüsselung identisch mit der Entschlüsselung. Wendet man ROT13 zweimal an, erhält man wieder den Ursprungstext. Dieses Verfahren wird oft in Online-Foren genutzt, um Spoiler oder Pointen zu verbergen, ohne einen ernsthaften Sicherheitsanspruch zu erheben.

Historisch bedeutsamer ist die Entwicklung hin zur Vigenère-Verschlüsselung im 16. Jahrhundert. Blaise de Vigenère (und vor ihm Giovan Battista Bellaso) nutzte die Cäsar-Chiffre als Baustein für eine polyalphabetische Substitution. Anstatt den gesamten Text mit demselben Verschiebewert \$k\$ zu codieren, wird ein Schlüsselwort verwendet. Jeder Buchstabe des Schlüsselworts bestimmt einen eigenen Cäsar-Shift für den entsprechenden Buchstaben des Klartextes. Dies nivelliert die statistischen Auffälligkeiten der Sprache und machte die Verschlüsselung über Jahrhunderte hinweg resistent gegen einfache Häufigkeitsanalysen, bis Charles Babbage und Friedrich Kasiski im 19. Jahrhundert Methoden zu deren Brechung entwickelten.

## Rezeption und didaktische Bedeutung

Die Wirksamkeit der Cäsar-Chiffre zur Zeit der Römischen Republik basierte weniger auf mathematischer Komplexität als auf dem allgemeinen Bildungsstand der Bevölkerung. Ein Großteil der Gegner Roms, aber auch viele römische Soldaten, waren Analphabeten. Für sie erschienen die Zeichenfolgen ohnehin bedeutungslos. Jene, die lesen konnten, vermuteten hinter den unverständlichen Buchstabenfolgen oft eher eine fremde Sprache als eine bewusste Verschlüsselung. Das Prinzip "Security through Obscurity" (Sicherheit durch Unklarheit/Geheimhaltung des Verfahrens) funktionierte nur solange, wie das Konzept der systematischen Buchstabenverschiebung unbekannt war.

Heute dient die Cäsar-Verschlüsselung in der Informatik und Mathematik fast ausschließlich didaktischen Zwecken. Sie ist das Standardbeispiel, um in die modulare Arithmetik einzuführen und den Unterschied zwischen Alphabet und Schlüsselraum zu erklären. Sie verdeutlicht auf anschauliche Weise, warum Determinität und Strukturerhalt in der Verschlüsselung gravierende Sicherheitslücken darstellen und warum moderne Verfahren wie AES (Advanced Encryption Standard) auf komplexen mathematischen Transformationen (Konfusion und Diffusion) basieren müssen, um statistische Muster im Chiffrat vollständig zu eliminieren.
`
  },
  translations: {
  "en": {
    "title": "",
    "excerpt": "",
    "content": {
      "diary": "",
      "scientific": ""
    }
  },
  "la": {
    "title": "",
    "excerpt": "",
    "content": {
      "diary": "",
      "scientific": ""
    }
  }
}
};

export default post;
