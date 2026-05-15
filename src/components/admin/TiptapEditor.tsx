import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = "Beginne zu schreiben..." }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-4',
      },
    },
  });

  if (!editor) {
    return <div className="p-4 text-muted-foreground">Editor wird geladen...</div>;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleHeading1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const insertHorizontalRule = () => editor.chain().focus().setHorizontalRule().run();

  return (
    <div className="relative">
      {/* Main Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/30">
        <button
          onClick={toggleHeading1}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('heading', { level: 1 }) && "bg-primary/10 text-primary"
          )}
          title="Überschrift 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={toggleHeading2}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('heading', { level: 2 }) && "bg-primary/10 text-primary"
          )}
          title="Überschrift 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={toggleHeading3}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('heading', { level: 3 }) && "bg-primary/10 text-primary"
          )}
          title="Überschrift 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-border mx-1" />
        
        <button
          onClick={toggleBold}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('bold') && "bg-primary/10 text-primary"
          )}
          title="Fett"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={toggleItalic}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('italic') && "bg-primary/10 text-primary"
          )}
          title="Kursiv"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={toggleStrike}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('strike') && "bg-primary/10 text-primary"
          )}
          title="Durchgestrichen"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={toggleCode}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('code') && "bg-primary/10 text-primary"
          )}
          title="Inline-Code"
        >
          <Code className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-border mx-1" />
        
        <button
          onClick={toggleBulletList}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('bulletList') && "bg-primary/10 text-primary"
          )}
          title="Aufzählungsliste"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={toggleOrderedList}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('orderedList') && "bg-primary/10 text-primary"
          )}
          title="Nummerierte Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={toggleBlockquote}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('blockquote') && "bg-primary/10 text-primary"
          )}
          title="Zitat"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={toggleCodeBlock}
          className={cn(
            "p-1.5 rounded hover:bg-muted transition-colors",
            editor.isActive('codeBlock') && "bg-primary/10 text-primary"
          )}
          title="Code-Block"
        >
          <Code2 className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-border mx-1" />
        
        <button
          onClick={insertHorizontalRule}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          title="Trennlinie"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[400px]" />
    </div>
  );
}
