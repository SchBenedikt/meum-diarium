'use client';

import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  handleCommandNavigation,
  StarterKit,
  Placeholder,
  type SuggestionItem,
} from 'novel';
import { cn } from '@/lib/utils';

// Markdown conversion utilities - stores MD in DB for portability
const htmlToMarkdown = (html: string): string => {
  if (!html || html === '<p></p>') return '';
  
  return html
    .replace(/<h1>/g, '# ').replace(/<\/h1>/g, '\n\n')
    .replace(/<h2>/g, '## ').replace(/<\/h2>/g, '\n\n')
    .replace(/<h3>/g, '### ').replace(/<\/h3>/g, '\n\n')
    .replace(/<p>/g, '').replace(/<\/p>/g, '\n\n')
    .replace(/<strong>/g, '**').replace(/<\/strong>/g, '**')
    .replace(/<b>/g, '**').replace(/<\/b>/g, '**')
    .replace(/<em>/g, '*').replace(/<\/em>/g, '*')
    .replace(/<i>/g, '*').replace(/<\/i>/g, '*')
    .replace(/<code>/g, '`').replace(/<\/code>/g, '`')
    .replace(/<pre><code>/g, '```\n').replace(/<\/code><\/pre>/g, '\n```\n')
    .replace(/<blockquote>/g, '> ').replace(/<\/blockquote>/g, '\n')
    .replace(/<ul>/g, '').replace(/<\/ul>/g, '\n')
    .replace(/<ol>/g, '').replace(/<\/ol>/g, '\n')
    .replace(/<li>/g, '- ').replace(/<\/li>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
};

const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
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

const customSlashItems: SuggestionItem[] = [
  { title: 'Text', description: 'Einfacher Text', searchTerms: ['p'], icon: '📝', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run() },
  { title: 'Überschrift 1', description: 'Große Überschrift', searchTerms: ['h1'], icon: 'H1', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run() },
  { title: 'Überschrift 2', description: 'Mittlere Überschrift', searchTerms: ['h2'], icon: 'H2', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run() },
  { title: 'Überschrift 3', description: 'Kleine Überschrift', searchTerms: ['h3'], icon: 'H3', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run() },
  { title: 'Aufzählung', description: 'Unsortierte Liste', searchTerms: ['list'], icon: '•', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: 'Nummerierung', description: 'Sortierte Liste', searchTerms: ['ol'], icon: '1.', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
  { title: 'Zitat', description: 'Zitat einfügen', searchTerms: ['quote'], icon: '❝', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
  { title: 'Code', description: 'Code-Block', searchTerms: ['code'], icon: '⌘', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setCodeBlock().run() },
  { title: 'Trennlinie', description: 'Horizontale Linie', searchTerms: ['hr'], icon: '—', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
];

interface NovelEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function NovelEditor({ content, onChange, placeholder }: NovelEditorProps) {
  const initialHtml = markdownToHtml(content);

  return (
    <EditorRoot>
      <div className="relative w-full">
        <EditorContent
          initialContent={initialHtml ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] } : undefined}
          extensions={[
            StarterKit.configure({ bulletList: { keepMarks: true }, orderedList: { keepMarks: true } }),
            Placeholder.configure({ placeholder: placeholder || "Beginne zu schreiben... Drücke '/' für Befehle" }),
          ]}
          className="min-h-[400px] w-full p-4 prose prose-sm dark:prose-invert max-w-none focus:outline-none bg-white dark:bg-[#1a1a1a] rounded-lg border"
          editorProps={{ handleDOMEvents: { keydown: (_view, event) => handleCommandNavigation(event) }, attributes: { class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none' } }}
          onUpdate={({ editor }) => onChange(htmlToMarkdown(editor.getHTML()))}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-popover px-1 py-2 shadow-md">
            <EditorCommandEmpty className="px-2 text-muted-foreground">Kein Befehl gefunden</EditorCommandEmpty>
            <EditorCommandList>
              {customSlashItems.map((item) => (
                <EditorCommandItem key={item.title} value={item.title} onCommand={() => {}} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-muted bg-background font-bold text-sm">{item.icon}</div>
                  <div><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.description}</p></div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble tippyOptions={{ placement: 'top' }} className="flex w-fit overflow-hidden rounded-md border border-muted bg-popover shadow-xl">
            <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleBold().run()} className="p-2 hover:bg-accent cursor-pointer font-bold">B</EditorBubbleItem>
            <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleItalic().run()} className="p-2 hover:bg-accent cursor-pointer italic">I</EditorBubbleItem>
            <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleStrike().run()} className="p-2 hover:bg-accent cursor-pointer line-through">S</EditorBubbleItem>
            <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleCode().run()} className="p-2 hover:bg-accent cursor-pointer font-mono text-sm">&lt;/&gt;</EditorBubbleItem>
          </EditorBubble>
        </EditorContent>
      </div>
    </EditorRoot>
  );
}
