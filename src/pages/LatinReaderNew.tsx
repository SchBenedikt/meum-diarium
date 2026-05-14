import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookMarked, BookOpen, CheckCircle, Copy, Eye, EyeOff, Library, Maximize2, Minimize2, StickyNote, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { works } from '@/data/works';

// Import Latin texts
import deBelloGallicoText from '@/data/latin/caesar-de-bello-gallico.json';
import deOfficiisText from '@/data/latin-texts/de-officiis.json';
import sallustBellumCatilinae from '@/data/latin/sallust-bellum-catilinae.json';
import senecaDeBrevitateVitae from '@/data/latin/seneca-de-brevitate-vitae.json';
import senecaDeVitaBeata from '@/data/latin/seneca-de-vita-beata.json';
import senecaDeTranquillitateAnimi from '@/data/latin/seneca-de-tranquillitate-animi.json';
import senecaDeClementia from '@/data/latin/seneca-de-clementia.json';
import resGestae from '@/data/latin/res-gestae.json';

interface LatinSection { id?: string; number: number; latin: string; sentences: string[]; lines?: string[]; }
interface LatinBook { id?: string; number?: number; title?: string; chapters?: LatinSection[]; sections?: LatinSection[]; }
interface LatinText { id: string; title: string; author: string; books: LatinBook[]; }

// Latin texts registry
const LATIN_TEXTS: Record<string, LatinText> = {
  'de-bello-gallico': deBelloGallicoText as unknown as LatinText,
  'de-officiis': deOfficiisText as unknown as LatinText,
  'bellum-catilinae': sallustBellumCatilinae as unknown as LatinText,
  'catilinae-coniuratio': sallustBellumCatilinae as unknown as LatinText,
  'de-brevitate-vitae': senecaDeBrevitateVitae as unknown as LatinText,
  'de-vita-beata': senecaDeVitaBeata as unknown as LatinText,
  'de-tranquillitate-animi': senecaDeTranquillitateAnimi as unknown as LatinText,
  'de-clementia': senecaDeClementia as unknown as LatinText,
  'res-gestae': resGestae as unknown as LatinText,
};

const AUTHOR_LABELS: Record<string, string> = {
  caesar: 'Julius Caesar',
  cicero: 'Marcus Tullius Cicero',
  augustus: 'Kaiser Augustus',
  seneca: 'Seneca',
  catilina: 'Lucius Sergius Catilina',
  sallust: 'Gaius Sallustius Crispus',
  sokrates: 'Sokrates',
};

const FONT_SCALES = [
  { label: 'A-', value: 'text-base' },
  { label: 'A', value: 'text-lg' },
  { label: 'A+', value: 'text-xl' },
];

const SENTENCE_TRANSLATIONS: Record<string, string> = {
  'Omnia orta occidunt et aucta senescunt.': 'Alles, was entstanden ist, geht zugrunde, und alles, was gewachsen ist, altert.',
  'L. Catilina, nobili genere natus, fuit magna vi et animi et corporis, sed ingenio malo pravoque.': 'Lucius Catilina, aus adligem Geschlecht geboren, besaß große Kraft des Geistes und des Körpers, aber eine schlechte und verdorbene Natur.',
  'Caesar beneficiis ac munificentia magnus habebatur, integritate vitae Cato.': 'Caesar galt durch Wohltaten und Freigiebigkeit als groß, Cato durch seine untadelige Lebensführung.',
  'In altero miseris perfugium erat, in altero malis pernicies.': 'Bei dem einen fanden die Unglücklichen Zuflucht, bei dem anderen erwartete die Schlechten ihr Verderben.',
  'Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.': 'Ganz Gallien ist in drei Teile geteilt, von denen den einen die Belger bewohnen, den anderen die Aquitaner, den dritten diejenigen, die in ihrer eigenen Sprache Kelten, in unserer Gallier genannt werden.',
  'Maior pars mortalium, Pauline, de naturae malignitate conqueritur, quod in exiguum aeui gignimur': 'Der größte Teil der Sterblichen, Paulinus, beklagt sich über die Missgunst der Natur, dass wir für eine kurze Lebenszeit geboren werden',
  'Non exiguum temporis habemus, sed multum perdidimus.': 'Wir haben nicht wenig Zeit, sondern wir haben viel verloren.',
  'Satis longa uita et in maximarum rerum consummationem large data est, si tota bene collocaretur': 'Lang genug ist das Leben und für die Vollendung der größten Dinge reichlich gegeben, wenn es ganz gut angelegt würde.',
  'Quid de rerum natura querimur? Illa se benigne gessit: uita, si uti scias, longa est.': 'Was beklagen wir uns über die Natur? Sie hat sich wohlwollend verhalten: Das Leben, wenn du es zu nutzen weißt, ist lang.',
  'Maximum uiuendi impedimentum est exspectatio, quae pendet ex crastino, perdit hodiernum.': 'Das größte Hindernis des Lebens ist die Erwartung, die am Morgen hängt und den heutigen Tag verdirbt.',
  'Omnia quae uentura sunt in incerto iacent: protinus uiue.': 'Alles, was kommen wird, liegt im Ungewissen: Lebe sofort.',
  'Quid cunctaris? Quid cessas? Nisi occupas, fugit.': 'Was zögerst du? Was säumst du? Wenn du es nicht ergreifst, flieht es.',
  'Dum differtur vita transcurrit.': 'Während das Leben aufgeschoben wird, eilt es dahin.',
  'Tota uitae suae ratio in contrarium fert.': 'Die ganze Lebensführung wird ins Gegenteil verkehrt.',
  'Nihil minus est hominis occupati quam uiuere': 'Nichts ist weniger Sache eines beschäftigten Menschen als zu leben.',
  'Viuere militare est.': 'Leben heißt kämpfen.',
  'Quomodo fabula, sic uita: non quam diu, sed quam bene acta sit, refert.': 'Wie ein Schauspiel, so das Leben: Nicht wie lange, sondern wie gut es gespielt wurde, kommt darauf an.',
  'Omnis homines, qui sese student praestare ceteris animalibus, summa ope niti decet, ne vitam silentio transeant veluti pecora, quae natura prona atque ventri oboedientia finxit.': 'Allen Menschen, die sich bestreben, sich vor den übrigen Tieren auszuzeichnen, ziemt es, mit höchster Kraft danach zu streben, nicht ihr Leben schweigend zu verbringen wie das Vieh, das die Natur gebeugt und dem Bauch gehorsam geschaffen hat.',
  'Sed nostra omnis vis in animo et corpore sita est; animi imperio, corporis servitio magis utimur': 'Aber unsere ganze Kraft liegt in Geist und Körper; des Geistes Befehl, des Körpers Dienst gebrauchen wir mehr.',
  'Igitur de Catilinae coniuratione quam verissume potero paucis absolvam': 'Daher werde ich über die Verschwörung Catilinas so wahrheitsgetreu wie ich kann in Kürze darlegen.',
  'Gallos ab Aquitanis Garumna flumen, a Belgis Matrona et Sequana dividit': 'Die Gallier scheidet von den Aquitaniern der Fluss Garonne, von den Belgiern die Marne und die Seine.',
  'Horum omnium fortissimi sunt Belgae': 'Von allen diesen sind die tapfersten die Belgier.',
  'Apud Helvetios longe nobilissimus fuit et ditissimus Orgetorix': 'Bei den Helvetiern war bei weitem der angesehenste und reichste Orgetorix.',
  'Id hoc facilius eis persuasit, quod undique loci natura Helvetii continentur': 'Dies redete er ihnen umso leichter ein, weil die Helvetier von allen Seiten durch die Natur des Ortes eingeschlossen werden.',
  'Qua de causa Helvetii quoque reliquos Gallos virtute praecedunt': 'Aus diesem Grund übertreffen auch die Helvetier die übrigen Gallier an Tapferkeit.',
  'Rex erat unus, qui summam imperii habebat': 'Es gab einen König, der die höchste Befehlsgewalt innehatte.',
  'Ea res est Helvetiis per indicium enuntiata': 'Diese Sache wurde den Helvetiern durch Anzeige verraten.',
  'Caesar cum id nuntiatum esset, maturat ab urbe proficisci': 'Als Caesar dies gemeldet wurde, eilt er, von der Stadt aufzubrechen.',
  'Quibus rebus cognitis, Caesar apud milites contionatur': 'Nachdem diese Dinge bekannt geworden waren, hält Caesar eine Ansprache vor den Soldaten.',
  'Neminem id paenitere debet, quod cum omnibus viribus rem publicam defenderit': 'Niemanden sollte es reuen, dass er mit allen Kräften den Staat verteidigt hat.',
};

const VOCAB_MAP: Record<string, string> = {
  virtus: 'Tugend, Tapferkeit', avaritia: 'Habgier, Gier', gloria: 'Ruhm, Ehre',
  patria: 'Vaterland', imperium: 'Befehlsgewalt, Reich', senatus: 'Senat',
  consul: 'Konsul', bellum: 'Krieg', pax: 'Frieden', mos: 'Sitte, Brauch',
  populus: 'Volk', res: 'Sache, Ding', publica: 'öffentlich, staatlich',
  provincia: 'Provinz, Amtsbereich', exercitus: 'Heer', legio: 'Legion',
  legatus: 'Gesandter, Legat', castra: 'Lager', proelium: 'Schlacht',
  hostis: 'Feind', miles: 'Soldat', dux: 'Führer, Feldherr',
  rex: 'König', regnum: 'Königreich', libertas: 'Freiheit',
  iustitia: 'Gerechtigkeit', honos: 'Ehre, Amt', fortuna: 'Glück, Schicksal',
  caelum: 'Himmel', terra: 'Erde', mare: 'Meer', flumen: 'Fluss',
  urbs: 'Stadt', domus: 'Haus', amicus: 'Freund', inimicus: 'Feind',
  vita: 'Leben', mors: 'Tod', animus: 'Geist, Seele', corpus: 'Körper',
  tempus: 'Zeit', dies: 'Tag', nox: 'Nacht', annus: 'Jahr',
  magnus: 'groß', parvus: 'klein', bonus: 'gut', malus: 'schlecht',
  omnis: 'jeder, ganz', multus: 'viel', paucus: 'wenig', totus: 'ganz',
  princeps: 'Erster, Führer', civitas: 'Bürgerschaft, Staat',
  auxilium: 'Hilfe', victoria: 'Sieg', lex: 'Gesetz',
  ius: 'Recht', causa: 'Grund, Ursache', ratio: 'Vernunft, Berechnung',
  oratio: 'Rede', verbum: 'Wort', littera: 'Buchstabe, Brief',
  sapientia: 'Weisheit', philosophia: 'Philosophie',
};
const VOCAB_PATTERN = new RegExp(
  `\\b(${Object.keys(VOCAB_MAP).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi',
);

function getBookKey(book: LatinBook): string { return String(book.id ?? book.number ?? 0); }
function getChapterKey(section: LatinSection): string { return String(section.id ?? section.number ?? 0); }
function countWords(text: string): number { return text.trim().split(/\s+/).filter(Boolean).length; }
function estimatedReadingTime(words: number): string { const m = Math.ceil(words / 200); return m === 1 ? '~1 Min.' : `~${m} Min.`; }

function loadReadProgress(workSlug: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(`read-progress-${workSlug}`) ?? '[]')); }
  catch { return new Set(); }
}
function saveReadProgress(workSlug: string, progress: Set<string>) {
  localStorage.setItem(`read-progress-${workSlug}`, JSON.stringify([...progress]));
}
function loadNote(workSlug: string, chapterKey: string): string {
  return localStorage.getItem(`note-${workSlug}-${chapterKey}`) ?? '';
}
function saveNote(workSlug: string, chapterKey: string, text: string) {
  localStorage.setItem(`note-${workSlug}-${chapterKey}`, text);
}

function renderWithVocab(
  sentence: string,
  vocabMode: boolean,
  activeVocabWord: { word: string; index: number } | null,
  setActiveVocabWord: React.Dispatch<React.SetStateAction<{ word: string; index: number } | null>>,
  sentenceIndex: number,
): React.ReactNode {
  if (!vocabMode) return sentence;
  const pattern = new RegExp(VOCAB_PATTERN.source, VOCAB_PATTERN.flags);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let wordIdx = 0;
  while ((match = pattern.exec(sentence)) !== null) {
    if (match.index > lastIndex) parts.push(sentence.slice(lastIndex, match.index));
    const word = match[0];
    const meaning = VOCAB_MAP[word.toLowerCase()];
    const key = `${sentenceIndex}-${match.index}`;
    const isActive = activeVocabWord?.word === key;
    parts.push(
      <span
        key={key}
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        aria-label={`${word}: ${meaning}`}
        className={`relative cursor-pointer underline decoration-dotted decoration-primary/60 ${isActive ? 'text-primary' : 'text-primary/80'}`}
        onClick={(e) => {
          e.stopPropagation();
          setActiveVocabWord(prev => prev?.word === key ? null : { word: key, index: match!.index });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setActiveVocabWord(prev => prev?.word === key ? null : { word: key, index: match!.index });
          }
        }}
        title={meaning}
      >
        {word}
        {isActive && (
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap rounded-lg bg-popover border border-border px-3 py-1.5 text-xs text-popover-foreground shadow-lg pointer-events-none">
            {meaning}
          </span>
        )}
      </span>,
    );
    lastIndex = match.index + match[0].length;
    wordIdx++;
  }
  if (lastIndex < sentence.length) parts.push(sentence.slice(lastIndex));
  return parts;
}

export default function LatinReaderNew() {
  const { authorId, workSlug } = useParams<{ authorId?: string; workSlug?: string }>();
  const navigate = useNavigate();
  const [selectedBookKey, setSelectedBookKey] = useState<string>('');
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number | null>(null);
  const [fontScale, setFontScale] = useState(FONT_SCALES[1].value);
  const [selectedSentence, setSelectedSentence] = useState<string | null>(null);
  const [vocabMode, setVocabMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [readProgress, setReadProgress] = useState<Set<string>>(new Set());
  const [noteText, setNoteText] = useState('');
  const [copiedSentence, setCopiedSentence] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [activeVocabWord, setActiveVocabWord] = useState<{ word: string; index: number } | null>(null);
  const noteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const availableAuthors = useMemo(
    () => Array.from(new Set(Object.values(works).map(w => (w as { author: string }).author))),
    [],
  );

  const authorWorks = useMemo(
    () => (authorId ? Object.values(works).filter(w => (w as { author: string }).author === authorId) : []),
    [authorId],
  );

  const selectedWork = workSlug ? works[workSlug as keyof typeof works] : null;
  const latinText = workSlug ? LATIN_TEXTS[workSlug] : null;

  const books = useMemo(() => latinText?.books || [], [latinText]);
  const selectedBook = useMemo(
    () => books.find(b => getBookKey(b) === selectedBookKey) ?? books[0] ?? null,
    [books, selectedBookKey],
  );
  const sections = useMemo(
    () => selectedBook ? (selectedBook.chapters ?? selectedBook.sections ?? []) : [],
    [selectedBook],
  );
  const selectedSection = useMemo(
    () => sections.find(s => s.number === selectedSectionNumber) ?? sections[0] ?? null,
    [sections, selectedSectionNumber],
  );
  const sentences = useMemo<string[]>(() => selectedSection?.sentences ?? [], [selectedSection]);
  const chapterKey = selectedSection ? getChapterKey(selectedSection) : '';
  const { wordCount, readingTime } = useMemo(() => {
    const text = selectedSection?.latin ?? '';
    const wc = countWords(text);
    return { wordCount: wc, readingTime: estimatedReadingTime(wc) };
  }, [selectedSection]);
  const bookProgress = useMemo(() => {
    const total = sections.length;
    if (!total) return 0;
    const done = sections.filter(s => readProgress.has(getChapterKey(s))).length;
    return Math.round((done / total) * 100);
  }, [sections, readProgress]);
  const isCurrentChapterRead = chapterKey ? readProgress.has(chapterKey) : false;

  // Load read progress when work changes
  useEffect(() => {
    if (workSlug) setReadProgress(loadReadProgress(workSlug));
  }, [workSlug]);

  // Load note when chapter changes
  useEffect(() => {
    if (workSlug && chapterKey) setNoteText(loadNote(workSlug, chapterKey));
  }, [workSlug, chapterKey]);

  // Auto-save note with debounce
  useEffect(() => {
    if (!workSlug || !chapterKey) return;
    if (noteDebounceRef.current) clearTimeout(noteDebounceRef.current);
    noteDebounceRef.current = setTimeout(() => {
      saveNote(workSlug, chapterKey, noteText);
    }, 600);
    return () => { if (noteDebounceRef.current) clearTimeout(noteDebounceRef.current); };
  }, [noteText, workSlug, chapterKey]);

  useEffect(() => {
    if (books.length > 0) setSelectedBookKey(getBookKey(books[0]));
  }, [workSlug, books]);

  useEffect(() => {
    if (sections.length > 0) setSelectedSectionNumber(sections[0].number);
    setSelectedSentence(null);
  }, [selectedBookKey, sections]);

  useEffect(() => {
    if (!activeVocabWord) return;
    const close = () => setActiveVocabWord(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [activeVocabWord]);

  const toggleMarkRead = useCallback(() => {
    if (!workSlug || !chapterKey) return;
    setReadProgress(prev => {
      const next = new Set(prev);
      if (next.has(chapterKey)) next.delete(chapterKey);
      else next.add(chapterKey);
      saveReadProgress(workSlug, next);
      return next;
    });
  }, [workSlug, chapterKey]);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const copySentence = useCallback((sentence: string) => {
    const doCopy = (text: string) => {
      setCopiedSentence(text);
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedSentence(null), 2000);
    };

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(sentence).then(() => doCopy(sentence)).catch(() => {
        // fallback: execCommand
        const ta = document.createElement('textarea');
        ta.value = sentence;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { if (document.execCommand('copy')) doCopy(sentence); } catch { /* silent */ }
        document.body.removeChild(ta);
      });
    } else {
      // Non-secure context fallback
      const ta = document.createElement('textarea');
      ta.value = sentence;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { if (document.execCommand('copy')) doCopy(sentence); } catch { /* silent */ }
      document.body.removeChild(ta);
    }
  }, []);

  // Step 1: Author Selection
  if (!authorId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
          <div className="mb-16">
            <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Zurück zu Lernen
            </Link>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              Lateinische <span className="text-primary">Texte</span> lesen
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Ein fokussierter Reader für antike Originaltexte. Wähle einen Autor und lies ohne Ablenkung im reinen Lesemodus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableAuthors.map((author, index: number) => (
              <motion.div
                key={`author-${author}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => navigate(`/reader/${author}`)}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{AUTHOR_LABELS[author as string] || author}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Object.values(works).filter((w: any) => w.author === author).length} Werke
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Step 2: Work Selection
  if (!workSlug) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
          <div className="mb-16">
            <Link to="/reader" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Zurück zur Autorwahl
            </Link>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight mb-4 capitalize">
              Werke von <span className="text-primary">{AUTHOR_LABELS[authorId] || authorId}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Wähle ein Werk. Verfügbare Texte öffnen direkt im Reader, nicht verfügbare Texte werden als „bald verfügbar" markiert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorWorks.map((work: any, index: number) => (
              <motion.div
                key={`work-${work.slug || work.title || index}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => navigate(`/reader/${authorId}/${work.slug || work.title.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{work.title}</h3>
                      <p className="text-sm text-muted-foreground">{work.year}</p>
                      <p className="text-xs mt-2 font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        {LATIN_TEXTS[work.slug] ? 'Text verfügbar' : 'Bald verfügbar'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Step 3: Reader Mode
  return (
    <div className={fullscreen ? 'fixed inset-0 z-50 bg-background flex flex-col overflow-auto' : 'min-h-screen flex flex-col bg-background'}>
      <main className="flex-1 container mx-auto px-4 pb-24 max-w-7xl" style={{ paddingTop: fullscreen ? '1.5rem' : '8rem' }}>
        {!fullscreen && (
          <div className="mb-8">
            <Link to={`/reader/${authorId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" /> Zurück zur Werkauswahl
            </Link>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-2">
              {selectedWork?.title}
            </h1>
            <p className="text-muted-foreground">
              {(selectedWork as any)?.year} • <span>{AUTHOR_LABELS[authorId || ''] || authorId}</span>
            </p>
          </div>
        )}

        {!latinText ? (
          <Card className="p-8">
            <div className="text-center py-8 text-muted-foreground">
              <Library className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Für dieses Werk liegt aktuell noch kein vollständig aufbereiteter Reader-Text vor.</p>
              <p className="text-sm mt-2">Bitte wähle ein anderes Werk oder komme später erneut vorbei.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="sticky top-4 z-30 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/95 backdrop-blur px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-1">
                {FONT_SCALES.map((size) => (
                  <Button
                    key={size.label}
                    variant={fontScale === size.value ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-xl h-8 px-3 text-xs"
                    onClick={() => setFontScale(size.value)}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant={vocabMode ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-xl h-8 px-3 gap-1.5 text-xs"
                  onClick={() => setVocabMode(v => !v)}
                  title="Vokabelmodus"
                >
                  {vocabMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">Vokabeln</span>
                </Button>
                <Button
                  variant={showNotes ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-xl h-8 px-3 gap-1.5 text-xs"
                  onClick={() => setShowNotes(v => !v)}
                  title="Notizen"
                >
                  <StickyNote className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Notizen</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl h-8 px-3"
                  onClick={() => setFullscreen(v => !v)}
                  title={fullscreen ? 'Vollbild beenden' : 'Vollbild'}
                >
                  {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar: book / chapter / progress */}
              <div className="lg:w-64 shrink-0 space-y-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Buch</label>
                      <select
                        value={selectedBookKey}
                        onChange={(e) => setSelectedBookKey(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                      >
                        {books.map((book) => (
                          <option key={getBookKey(book)} value={getBookKey(book)}>
                            {book.title || `Buch ${book.number}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Kapitel</label>
                      <select
                        value={selectedSection?.number ?? ''}
                        onChange={(e) => setSelectedSectionNumber(Number(e.target.value))}
                        className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                      >
                        {sections.map((section) => (
                          <option key={section.number} value={section.number}>
                            Kapitel {section.number}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      variant={isCurrentChapterRead ? 'default' : 'outline'}
                      size="sm"
                      className="w-full rounded-xl gap-2"
                      onClick={toggleMarkRead}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {isCurrentChapterRead ? 'Als gelesen markiert' : 'Als gelesen markieren'}
                    </Button>
                  </div>
                </Card>

                {/* Progress */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookMarked className="h-4 w-4 text-primary" />
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Fortschritt</span>
                  </div>
                  <div className="h-1.5 bg-primary/20 rounded-full mb-1.5">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${bookProgress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{bookProgress}% gelesen</p>
                </Card>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0 space-y-4">
                {/* Stats bar */}
                {selectedSection && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
                    <span>{wordCount} Wörter</span>
                    <span>•</span>
                    <span>{readingTime} Lesezeit</span>
                    <span>•</span>
                    <span>Kapitel {selectedSection.number}</span>
                  </div>
                )}

                {/* Text card */}
                <Card className="p-6 sm:p-10">
                  {selectedSection ? (
                    <article className={`${fontScale} leading-9 text-foreground/95 font-serif`}>
                      <h3 className="font-display text-2xl font-bold mb-6 not-italic">
                        {selectedBook?.title || `Buch ${selectedBook?.number}`}, Kapitel {selectedSection.number}
                      </h3>
                      {sentences.length > 0 ? (
                        <div className="space-y-1">
                          {sentences.map((sentence, i) => (
                            <span
                              key={i}
                              className={`relative group inline cursor-pointer rounded-xl px-2 -mx-2 transition-colors ${selectedSentence === sentence ? 'bg-primary/15' : 'hover:bg-muted/50'}`}
                              onClick={() => setSelectedSentence(prev => prev === sentence ? null : sentence)}
                            >
                              {renderWithVocab(sentence, vocabMode, activeVocabWord, setActiveVocabWord, i)}
                              {' '}
                              <button
                                className="inline-flex opacity-0 group-hover:opacity-100 transition-opacity align-middle ml-1 p-0.5 rounded text-muted-foreground hover:text-primary"
                                onClick={(e) => { e.stopPropagation(); copySentence(sentence); }}
                                title="Kopieren"
                              >
                                {copiedSentence === sentence
                                  ? <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                  : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p>{renderWithVocab(selectedSection.latin, vocabMode, activeVocabWord, setActiveVocabWord, 0)}</p>
                      )}
                    </article>
                  ) : (
                    <p className="text-muted-foreground">Kein Abschnitt gefunden.</p>
                  )}
                </Card>

                {/* Translation panel */}
                <AnimatePresence>
                  {selectedSentence && (
                    <motion.div
                      key="translation"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-5 border-primary/20 bg-primary/5">
                        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Satz analysieren</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="rounded-xl bg-background/60 border border-border/50 p-3">
                            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-1.5">Lateinisch</p>
                            <p className="text-sm font-serif italic text-foreground/90 leading-relaxed">{selectedSentence}</p>
                          </div>
                          <div className="rounded-xl bg-background/60 border border-border/50 p-3">
                            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-1.5">Deutsch</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {SENTENCE_TRANSLATIONS[selectedSentence] ?? (
                                <span className="italic opacity-60">Keine Übersetzung verfügbar.</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Notes panel */}
                <AnimatePresence>
                  {showNotes && (
                    <motion.div
                      key="notes"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                          <StickyNote className="h-3.5 w-3.5" /> Notizen zu Kapitel {selectedSection?.number}
                        </p>
                        <textarea
                          className="w-full min-h-[100px] resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="Deine Notizen zu diesem Kapitel..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        />
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </main>
      {!fullscreen && <Footer />}
    </div>
  );
}
