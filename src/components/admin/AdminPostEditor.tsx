import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPost, Author } from '@/types/blog';
import { toast } from 'sonner';

const AUTHORS: Author[] = ['caesar', 'cicero', 'augustus', 'seneca', 'catilina'];

const AUTHOR_CONFIG = {
  caesar: { name: 'Caesar', icon: '🏛️' },
  cicero: { name: 'Cicero', icon: '🗣️' },
  augustus: { name: 'Augustus', icon: '👑' },
  seneca: { name: 'Seneca', icon: '📜' },
  catilina: { name: 'Catilina', icon: '🗡️' },
} as const;

// Helper to insert markdown formatting
const insertMarkdown = (
  textarea: HTMLTextAreaElement | null,
  before: string,
  after: string = ''
) => {
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);
  
  const newText = text.substring(0, start) + before + selected + after + text.substring(end);
  
  // Update value and restore selection
  textarea.value = newText;
  textarea.setSelectionRange(start + before.length, end + before.length);
  textarea.focus();
  
  // Trigger change event
  textarea.dispatchEvent(new Event('change', { bubbles: true }));
};

// Formatting toolbar component
const FormattingToolbar = ({ textareaRef }: { textareaRef: React.RefObject<HTMLTextAreaElement> }) => {
  const buttons = [
    { icon: 'B', title: 'Fett', action: () => insertMarkdown(textareaRef.current, '**', '**') },
    { icon: 'I', title: 'Kursiv', action: () => insertMarkdown(textareaRef.current, '*', '*') },
    { icon: 'H1', title: 'Überschrift 1', action: () => insertMarkdown(textareaRef.current, '# ') },
    { icon: 'H2', title: 'Überschrift 2', action: () => insertMarkdown(textareaRef.current, '## ') },
    { icon: 'H3', title: 'Überschrift 3', action: () => insertMarkdown(textareaRef.current, '### ') },
    { icon: '•', title: 'Liste', action: () => insertMarkdown(textareaRef.current, '- ') },
    { icon: '1.', title: 'Nummerierung', action: () => insertMarkdown(textareaRef.current, '1. ') },
    { icon: '>', title: 'Zitat', action: () => insertMarkdown(textareaRef.current, '> ') },
    { icon: '`', title: 'Code', action: () => insertMarkdown(textareaRef.current, '`', '`') },
    { icon: '—', title: 'Trennlinie', action: () => insertMarkdown(textareaRef.current, '\n---\n') },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-muted border-b">
      {buttons.map((btn) => (
        <button
          key={btn.title}
          type="button"
          onClick={btn.action}
          title={btn.title}
          className="px-2 py-1 text-xs font-medium rounded hover:bg-accent hover:text-accent-foreground transition-colors min-w-[28px]"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
};

// Markdown to HTML converter for preview
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '<p class="text-muted-foreground italic">Noch kein Inhalt...</p>';
  if (markdown.trim().startsWith('<')) return markdown;
  
  return markdown
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/```\n?([\s\S]*?)\n?```/g, '<pre><code>$1</code></pre>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, '<ul>$&</ul>')
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p && !p.match(/^<[houbp]/))
    .map(p => `<p>${p}</p>`)
    .join('\n');
};

export function AdminPostEditor() {
  const { author: authorParam, slug: slugParam } = useParams<{ author: string; slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isNewPost = slugParam === 'new' || !slugParam;
  const authorId = authorParam || searchParams.get('author') || 'caesar';
  
  const [loading, setLoading] = useState(!isNewPost);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [post, setPost] = useState<Partial<BlogPost>>({
    id: Date.now().toString(),
    slug: '',
    author: (AUTHORS.includes(authorId as Author) ? authorId : 'caesar') as Author,
    title: '',
    diaryTitle: '',
    scientificTitle: '',
    excerpt: '',
    content: {
      diary: '',
      scientific: ''
    },
    historicalDate: '50 v. Chr.',
    historicalYear: -50,
    tags: [],
    sidebar: {
      facts: []
    }
  });

  // Load existing post
  useEffect(() => {
    if (!isNewPost && authorParam && slugParam) {
      loadPost(authorParam, slugParam);
    }
  }, [isNewPost, authorParam, slugParam]);

  const loadPost = async (author: string, slug: string) => {
    try {
      const res = await fetch(`/api/posts/${author}/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        toast.error('Beitrag konnte nicht geladen werden');
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      toast.error('Beitrag konnte nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save functionality
  const savePost = useCallback(async (showToast = true) => {
    if (saving) return;
    
    setSaving(true);
    try {
      const isUpdate = !isNewPost && authorParam && slugParam;
      const url = isUpdate 
        ? `/api/posts/${authorParam}/${slugParam}`
        : '/api/posts';
      const method = isUpdate ? 'PUT' : 'POST';
      
      // Ensure slug exists
      const finalPost = {
        ...post,
        slug: post.slug || post.title?.toLowerCase().replace(/\s+/g, '-') || Date.now().toString()
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPost)
      });

      if (res.ok) {
        setLastSaved(new Date());
        if (showToast) {
          toast.success(isUpdate ? 'Beitrag aktualisiert' : 'Beitrag erstellt');
        }
        
        // If new post, navigate to edit URL
        if (isNewPost) {
          navigate(`/admin/posts/${finalPost.author}/${finalPost.slug}`, { replace: true });
        }
      } else {
        const error = await res.json();
        toast.error(`Speichern fehlgeschlagen: ${error.error || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  }, [post, isNewPost, authorParam, slugParam, saving, navigate]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!isNewPost && post.title) {
      const interval = setInterval(() => {
        savePost(false);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [savePost, isNewPost, post.title]);

  // Keyboard shortcut (Cmd/Ctrl + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        savePost(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [savePost]);

  const updatePost = (updates: Partial<BlogPost>) => {
    setPost(prev => ({ ...prev, ...updates }));
  };

  // Update historical date and year in sync
  const updateHistoricalDate = (value: string) => {
    // Try to extract year from date string like "15. März 44 v. Chr." or "50 v. Chr."
    const yearMatch = value.match(/(-?\d+)\s*v\.?\s*Chr\.?/i);
    const year = yearMatch ? parseInt(yearMatch[1]) : undefined;
    
    setPost(prev => ({
      ...prev,
      historicalDate: value,
      historicalYear: year !== undefined ? year : prev.historicalYear
    }));
  };

  const updateHistoricalYear = (year: number) => {
    // Update year and try to keep the date format if it exists
    setPost(prev => {
      const existingDate = prev.historicalDate || '';
      // If date exists with year pattern, replace it
      const newDate = existingDate.replace(/-?\d+\s*v\.?\s*Chr\.?/i, `${year} v. Chr.`);
      return {
        ...prev,
        historicalYear: year,
        historicalDate: existingDate ? newDate : `${year} v. Chr.`
      };
    });
  };

  // Refs for textareas to use with formatting toolbar
  const diaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  const scientificTextareaRef = useRef<HTMLTextAreaElement>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-border bg-white dark:bg-[#191919]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            {isNewPost ? (
              <span className="text-sm text-muted-foreground">Neuer Beitrag</span>
            ) : (
              <>
                <span className="text-sm text-muted-foreground capitalize hidden sm:inline">{post.author}</span>
                <ChevronLeft className="w-3 h-3 text-muted-foreground hidden sm:inline" />
                <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">{post.title || 'Unbenannt'}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {lastSaved && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Gespeichert {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
          
          <Button
            size="sm"
            onClick={() => savePost(true)}
            disabled={saving}
          >
            <Save className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{saving ? 'Speichern...' : 'Speichern'}</span>
          </Button>
        </div>
      </header>

      {/* Main Content - Full width editor with inline preview */}
      <div className="flex-1 overflow-hidden w-full">
        <div className="flex flex-col border-r border-border overflow-hidden h-full w-full">
          <ScrollArea className="flex-1">
            <div className="w-full p-3 sm:p-6 space-y-6">
              {/* Configuration Fields - Compact layout at top */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                {/* Author Selector - only for new posts */}
                {isNewPost && (
                  <div className="space-y-2">
                    <Label>Autor</Label>
                    <select
                      value={post.author}
                      onChange={e => updatePost({ author: e.target.value as Author })}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {AUTHORS.map(author => (
                        <option key={author} value={author}>
                          {AUTHOR_CONFIG[author].icon} {AUTHOR_CONFIG[author].name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Slug */}
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input
                    value={post.slug}
                    onChange={e => updatePost({ slug: e.target.value })}
                    placeholder="beitrag-url"
                    className="w-full"
                  />
                </div>
                
                {/* Historical Date */}
                <div className="space-y-2">
                  <Label>Historisches Datum</Label>
                  <Input
                    value={post.historicalDate}
                    onChange={e => updateHistoricalDate(e.target.value)}
                    placeholder="z. B. 15. März 44 v. Chr."
                  />
                </div>
                
                {/* Year - hidden input (syncs automatically with date) */}
                <div className="space-y-2 md:col-span-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Jahr (numerisch): {post.historicalYear}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                {/* Dual Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-primary">
                      📔 Tagebuch-Titel
                    </Label>
                    <Input
                      value={post.diaryTitle}
                      onChange={e => updatePost({ diaryTitle: e.target.value })}
                      placeholder="Persönlicher Titel..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-primary">
                      📚 Wissenschaftlicher Titel
                    </Label>
                    <Input
                      value={post.scientificTitle}
                      onChange={e => updatePost({ scientificTitle: e.target.value })}
                      placeholder="Wissenschaftlicher Titel..."
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label>Kurzbeschreibung</Label>
                <Input
                  value={post.excerpt}
                  onChange={e => updatePost({ excerpt: e.target.value })}
                  placeholder="Kurze Zusammenfassung..."
                />
              </div>

              {/* Content Editor - Split View */}
              <Tabs defaultValue="diary" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="diary" className="flex-1">📔 Tagebuch</TabsTrigger>
                  <TabsTrigger value="scientific" className="flex-1">📚 Wissenschaftlich</TabsTrigger>
                </TabsList>
                
                <TabsContent value="diary" className="mt-4">
                  <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]">
                    {/* Editor */}
                    <div className="flex-1 flex flex-col border rounded-lg overflow-hidden min-h-[300px] md:min-h-0">
                      <div className="px-3 py-2 bg-muted border-b text-xs font-medium text-muted-foreground">
                        Markdown
                      </div>
                      <FormattingToolbar textareaRef={diaryTextareaRef} />
                      <textarea
                        ref={diaryTextareaRef}
                        value={post.content?.diary || ''}
                        onChange={e => updatePost({
                          content: { ...post.content, diary: e.target.value }
                        })}
                        placeholder="# Überschrift\n\nHier Markdown eingeben...\n\n**Fett** *Kursiv*\n- Listenpunkt 1\n- Listenpunkt 2"
                        className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-white dark:bg-[#1a1a1a]"
                        spellCheck={false}
                      />
                    </div>
                    {/* Live Preview */}
                    <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-[#f7f6f3] dark:bg-[#1a1a1a] min-h-[200px] md:min-h-0">
                      <div className="px-3 py-2 bg-white dark:bg-[#191919] border-b text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        Vorschau
                      </div>
                      <ScrollArea className="flex-1">
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none p-4"
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content?.diary || '') }}
                        />
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="scientific" className="mt-4">
                  <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]">
                    {/* Editor */}
                    <div className="flex-1 flex flex-col border rounded-lg overflow-hidden min-h-[300px] md:min-h-0">
                      <div className="px-3 py-2 bg-muted border-b text-xs font-medium text-muted-foreground">
                        Markdown
                      </div>
                      <FormattingToolbar textareaRef={scientificTextareaRef} />
                      <textarea
                        ref={scientificTextareaRef}
                        value={post.content?.scientific || ''}
                        onChange={e => updatePost({
                          content: { ...post.content, scientific: e.target.value }
                        })}
                        placeholder="# Wissenschaftliche Analyse\n\nHier Markdown eingeben...\n\n**Fett** *Kursiv*\n- Listenpunkt 1\n- Listenpunkt 2"
                        className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-white dark:bg-[#1a1a1a]"
                        spellCheck={false}
                      />
                    </div>
                    {/* Live Preview */}
                    <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-[#f7f6f3] dark:bg-[#1a1a1a] min-h-[200px] md:min-h-0">
                      <div className="px-3 py-2 bg-white dark:bg-[#191919] border-b text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        Vorschau
                      </div>
                      <ScrollArea className="flex-1">
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none p-4"
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content?.scientific || '') }}
                        />
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Historical Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Historisches Datum</Label>
                  <Input
                    value={post.historicalDate}
                    onChange={e => updatePost({ historicalDate: e.target.value })}
                    placeholder="z. B. 15. März 44 v. Chr."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jahr (numerisch)</Label>
                  <Input
                    type="number"
                    value={post.historicalYear}
                    onChange={e => updatePost({ historicalYear: parseInt(e.target.value) })}
                    placeholder="-44"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
