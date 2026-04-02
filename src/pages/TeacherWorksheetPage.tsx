import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { generateWorksheetAI } from '@/lib/api';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, FileDown, Loader2, Sparkles } from 'lucide-react';

type TaskType =
  | 'readingComprehension'
  | 'cloze'
  | 'multipleChoice'
  | 'translation'
  | 'interpretation'
  | 'discussion';

type TaskSettings = {
  enabled: boolean;
  difficulty: 1 | 2 | 3;
  amount: 1 | 2 | 3;
};

type WorksheetTask = {
  type: TaskType;
  title: string;
  instruction: string;
  material?: string;
  difficulty: 1 | 2 | 3;
};

type WorksheetData = {
  topic: string;
  title: string;
  subtitle: string;
  intro?: string;
  tasks: WorksheetTask[];
};

const TOPICS = [
  'Caesar: De Bello Gallico',
  'Cicero: In Catilinam',
  'Ovid: Metamorphoses',
  'Livy: Ab Urbe Condita',
  'Vergil: Aeneid',
  'Seneca: Epistulae Morales',
  'Tacitus: Annales',
  'Sallust: Bellum Catilinae',
  'Römische Republik und Politik',
  'Römische Rhetorik und Überzeugung',
  'Mythos und Verwandlung',
  'Krieg, Ethik und Führung',
  'Römischer Alltag und Gesellschaft',
  'Imperium und Macht',
  'Lateinische Grammatik im Kontext',
  'Römische Geschichtsschreibung',
  'Stoische Philosophie',
  'Rollenbilder in der Antike',
  'Erzählperspektive und Wirkung',
  'Recht, Gerechtigkeit und Bürgerschaft',
];

const TASK_LABELS: Record<TaskType, { title: string; short: string; accent: string }> = {
  readingComprehension: {
    title: 'Textverständnis',
    short: 'Textverständnis',
    accent: 'bg-primary/10 text-primary border-primary/30',
  },
  cloze: {
    title: 'Lückentext',
    short: 'Lückentext',
    accent: 'bg-primary/10 text-primary border-primary/30',
  },
  multipleChoice: {
    title: 'Multiple Choice',
    short: 'Multiple Choice',
    accent: 'bg-primary/10 text-primary border-primary/30',
  },
  translation: {
    title: 'Übersetzungsaufgaben',
    short: 'Übersetzung',
    accent: 'bg-primary/10 text-primary border-primary/30',
  },
  interpretation: {
    title: 'Interpretationsaufgaben',
    short: 'Interpretation',
    accent: 'bg-primary/10 text-primary border-primary/30',
  },
  discussion: {
    title: 'Diskussionsaufgaben / Impulsfragen (Hätte ...)',
    short: 'Diskussion',
    accent: 'bg-primary/10 text-primary border-primary/30',
  },
};

const defaultTaskConfig: Record<TaskType, TaskSettings> = {
  readingComprehension: { enabled: true, difficulty: 2, amount: 1 },
  cloze: { enabled: true, difficulty: 2, amount: 1 },
  multipleChoice: { enabled: true, difficulty: 2, amount: 1 },
  translation: { enabled: true, difficulty: 2, amount: 1 },
  interpretation: { enabled: true, difficulty: 2, amount: 1 },
  discussion: { enabled: true, difficulty: 2, amount: 1 },
};

function clampDifficulty(value: unknown, fallback: 1 | 2 | 3): 1 | 2 | 3 {
  const num = Number(value);
  if (num === 1 || num === 2 || num === 3) return num;
  return fallback;
}

function difficultyLabel(level: 1 | 2 | 3) {
  return `Niveau ${level}`;
}

export default function TeacherWorksheetPage() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [includeIntro, setIncludeIntro] = useState(true);
  const [teacherNote, setTeacherNote] = useState('');
  const [taskConfig, setTaskConfig] = useState(defaultTaskConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [worksheet, setWorksheet] = useState<WorksheetData | null>(null);

  const activeTaskTypes = useMemo(
    () => (Object.keys(taskConfig) as TaskType[]).filter((key) => taskConfig[key].enabled),
    [taskConfig]
  );

  const finalTopic = customTopic.trim() || topic;

  const updateTaskConfig = (type: TaskType, patch: Partial<TaskSettings>) => {
    setTaskConfig((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...patch,
      },
    }));
  };

  const buildFallbackWorksheet = (raw: string): WorksheetData => {
    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 18);

    const tasks: WorksheetTask[] = activeTaskTypes.map((type, idx) => ({
      type,
      title: `${TASK_LABELS[type].title} Aufgabe`,
      instruction: lines[idx] || 'Bearbeite die Aufgabe auf Grundlage des Materials.',
      material: lines[idx + 1] || undefined,
      difficulty: taskConfig[type].difficulty,
    }));

    return {
      topic: finalTopic,
      title: `${finalTopic} - Arbeitsblatt`,
      subtitle: 'KI-generiertes Unterrichtsmaterial',
      intro: includeIntro ? 'Dieses Arbeitsblatt unterstützt die Analyse, Übersetzung und Interpretation des gewählten Themas.' : undefined,
      tasks,
    };
  };

  const generateWorksheet = async () => {
    setError(null);

    if (!finalTopic.trim()) {
      setError('Bitte wähle ein Thema aus oder gib ein eigenes Thema ein.');
      return;
    }

    if (activeTaskTypes.length === 0) {
      setError('Bitte aktiviere mindestens einen Aufgabentyp.');
      return;
    }

    setIsGenerating(true);

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const payload = {
          topic: finalTopic,
          includeIntro,
          teacherNote: teacherNote.trim(),
          tasks: activeTaskTypes.map((type) => ({
            type,
            difficulty: taskConfig[type].difficulty,
            amount: taskConfig[type].amount,
          })),
        };

        const response = await generateWorksheetAI(payload);

        // Check if response has a warning (fallback was used)
        if (response.warning) {
          console.warn('[Worksheet] AI used fallback:', response.warning);
        }

        const rawWorksheet = response.worksheet;

        const normalizedTasks: WorksheetTask[] = rawWorksheet.tasks.map((task: unknown) => {
          const rawTask = (task && typeof task === 'object') ? (task as Record<string, unknown>) : {};
          const value = String(rawTask.type || '').toLowerCase();
          const type: TaskType = value.includes('reading')
            ? 'readingComprehension'
            : value.includes('cloze') || value.includes('gap')
            ? 'cloze'
            : value.includes('multiple')
            ? 'multipleChoice'
            : value.includes('translation')
            ? 'translation'
            : value.includes('interpret')
            ? 'interpretation'
            : value.includes('discussion') || value.includes('impulse') || value.includes('what')
            ? 'discussion'
            : 'readingComprehension';

          const fallbackDifficulty = taskConfig[type]?.difficulty ?? 2;
          return {
            type,
            title: String(rawTask.title || TASK_LABELS[type].title),
            instruction: String(rawTask.instruction || 'Bearbeite die Aufgabe sorgfältig.'),
            material: rawTask.material ? String(rawTask.material) : undefined,
            difficulty: clampDifficulty(rawTask.difficulty, fallbackDifficulty),
          };
        });

        if (!normalizedTasks.length) {
          throw new Error('Keine Aufgaben von der KI erhalten.');
        }

        setWorksheet({
          topic: finalTopic,
          title: String(rawWorksheet.title || `${finalTopic} - Arbeitsblatt`),
          subtitle: String(rawWorksheet.subtitle || 'KI-generiertes Unterrichtsmaterial'),
          intro: includeIntro ? String(rawWorksheet.intro || '') : undefined,
          tasks: normalizedTasks,
        });

        // Success - break out of retry loop
        setIsGenerating(false);
        return;

      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error('Unbekannter Fehler');
        console.error(`[Worksheet] Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    // All retries failed - show error
    setError(lastError?.message || 'Das Arbeitsblatt konnte nicht erstellt werden. Bitte versuche es erneut.');
    setIsGenerating(false);
  };

  const exportPdf = () => {
    if (!worksheet) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 52;
    let y = 62;

    const ensureSpace = (required: number) => {
      if (y + required < pageHeight - 52) return;
      doc.addPage();
      y = 62;
    };

    const writeWrapped = (text: string, size = 11, lineHeight = 16) => {
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
      lines.forEach((line: string) => {
        ensureSpace(lineHeight + 2);
        doc.text(line, marginX, y);
        y += lineHeight;
      });
    };

    // Meum-Diarium Rot Farbe: HSL(345, 60%, 35%) = RGB(128, 22, 79)
    const meumRed = { r: 128, g: 22, b: 79 };
    
    // Header mit Meum-Diarium Rot
    doc.setFillColor(meumRed.r, meumRed.g, meumRed.b);
    doc.rect(0, 0, pageWidth, 120, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(worksheet.title, marginX, 62);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Quelle: meum-diarium.schächner.de`, marginX, 84);
    doc.setFontSize(11);
    doc.text(`Thema: ${worksheet.topic}`, marginX, 102);

    y = 150;
    doc.setTextColor(17, 24, 39);

    if (worksheet.intro?.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(meumRed.r, meumRed.g, meumRed.b);
      doc.text('Einführung', marginX, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 24, 39);
      writeWrapped(worksheet.intro, 11, 16);
      y += 8;
    }

    worksheet.tasks.forEach((task, index) => {
      ensureSpace(110);
      
      // Task header box mit Meum-Diarium Rot Akzent
      doc.setDrawColor(meumRed.r, meumRed.g, meumRed.b);
      doc.setLineWidth(2);
      doc.roundedRect(marginX, y, pageWidth - marginX * 2, 22, 6, 6);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(meumRed.r, meumRed.g, meumRed.b);
      doc.text(`Aufgabe ${index + 1} · ${TASK_LABELS[task.type].short} · ${difficultyLabel(task.difficulty)}`, marginX + 10, y + 15);
      y += 34;

      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      writeWrapped(task.title, 12, 16);
      doc.setFont('helvetica', 'normal');
      writeWrapped(task.instruction, 11, 16);

      if (task.material) {
        y += 4;
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 80);
        writeWrapped(`Material: ${task.material}`, 10, 14);
        doc.setTextColor(17, 24, 39);
        doc.setFont('helvetica', 'normal');
      }

      y += 8;
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      for (let i = 0; i < 3; i++) {
        ensureSpace(20);
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 18;
      }
      y += 4;
    });

    const filename = worksheet.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataUri = doc.output('datauristring');
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${filename || 'arbeitsblatt'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/40" />
              LEHRERMATERIAL
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              KI-Arbeitsblatt <span className="text-primary italic">Studio</span>
            </h1>
            <p className="text-muted-foreground/80 max-w-2xl leading-relaxed">
              Erstelle professionelle, einheitliche Arbeitsblattpakete mit dynamischer Aufgaben-Auswahl, Schwierigkeitsstufen je Aufgabentyp und PDF-Export.
            </p>
          </div>
          <Link to="/lernen" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zu Lernen
          </Link>
        </div>

        <div className="grid xl:grid-cols-12 gap-6">
          <Card className="xl:col-span-5 border-border/50 bg-white/90 dark:bg-card/90 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label>Thema</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Thema wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Oder eigenes Thema eingeben"
                  value={customTopic}
                  onChange={(event) => setCustomTopic(event.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="teacher-note">Hinweis für die KI (optional)</Label>
                <Textarea
                  id="teacher-note"
                  value={teacherNote}
                  onChange={(event) => setTeacherNote(event.target.value)}
                  placeholder="Lernziele, Klassenstufe, Fokusbereiche ..."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                <div>
                  <p className="font-semibold">Kurze Einführung einfügen</p>
                  <p className="text-sm text-muted-foreground">Fügt am Anfang der PDF eine kompakte thematische Einordnung ein.</p>
                </div>
                <Switch checked={includeIntro} onCheckedChange={setIncludeIntro} />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Aufgabentypen und Schwierigkeit</p>
                <div className="space-y-3">
                  {(Object.keys(taskConfig) as TaskType[]).map((type) => {
                    const conf = taskConfig[type];
                    return (
                      <div key={type} className="rounded-xl border border-border/50 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={conf.enabled}
                              onCheckedChange={(checked) => updateTaskConfig(type, { enabled: Boolean(checked) })}
                            />
                            <span className="text-sm font-medium">{TASK_LABELS[type].title}</span>
                          </label>
                          <Badge variant="outline" className={TASK_LABELS[type].accent}>
                            {difficultyLabel(conf.difficulty)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={String(conf.difficulty)}
                            onValueChange={(value) => updateTaskConfig(type, { difficulty: Number(value) as 1 | 2 | 3 })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Schwierigkeit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Schwierigkeit 1</SelectItem>
                              <SelectItem value="2">Schwierigkeit 2</SelectItem>
                              <SelectItem value="3">Schwierigkeit 3</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={String(conf.amount)}
                            onValueChange={(value) => updateTaskConfig(type, { amount: Number(value) as 1 | 2 | 3 })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Anzahl" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Aufgabe</SelectItem>
                              <SelectItem value="2">2 Aufgaben</SelectItem>
                              <SelectItem value="3">3 Aufgaben</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex flex-wrap gap-3">
                <Button onClick={generateWorksheet} disabled={isGenerating || activeTaskTypes.length === 0} className="rounded-full">
                  {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Arbeitsblatt erstellen
                </Button>
                <Button variant="outline" onClick={exportPdf} disabled={!worksheet} className="rounded-full border-primary/40 text-primary hover:bg-primary/10">
                  <FileDown className="h-4 w-4 mr-2" /> PDF exportieren
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-7 border-border/50 bg-white/90 dark:bg-card/90 shadow-none">
            <CardContent className="p-6 sm:p-8">
              {worksheet ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Arbeitsblatt-Vorschau</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-2">{worksheet.title}</h2>
                    <p className="text-sm text-muted-foreground mb-1">{worksheet.subtitle}</p>
                    <p className="text-xs text-muted-foreground/70">Thema: {worksheet.topic}</p>
                  </div>

                  {worksheet.intro?.trim() && (
                    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Einführung</p>
                      <p className="text-sm leading-relaxed text-foreground">{worksheet.intro}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {worksheet.tasks.map((task, index) => (
                      <div key={`${task.title}-${index}`} className="rounded-xl border border-primary/20 p-5 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className="bg-primary text-white">Aufgabe {index + 1}</Badge>
                          <Badge variant="outline" className={TASK_LABELS[task.type].accent}>
                            {TASK_LABELS[task.type].short}
                          </Badge>
                          <Badge variant="outline">{difficultyLabel(task.difficulty)}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">{task.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{task.instruction}</p>
                        {task.material && (
                          <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 mb-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-1">Material</p>
                            <p className="text-sm leading-relaxed text-foreground">{task.material}</p>
                          </div>
                        )}
                        <div className="space-y-2 mt-4">
                          <div className="h-4 border-b border-dashed border-primary/40" />
                          <div className="h-4 border-b border-dashed border-primary/40" />
                          <div className="h-4 border-b border-dashed border-primary/40" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="min-h-[460px] rounded-2xl border border-dashed border-primary/40 flex items-center justify-center text-center p-8 bg-primary/5">
                  <div>
                    <p className="font-semibold text-foreground mb-2">Noch kein Arbeitsblatt erstellt</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Wähle links Thema und Aufgabenkonfiguration und erstelle danach ein professionelles, einheitliches Arbeitsblatt mit PDF-Export.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
