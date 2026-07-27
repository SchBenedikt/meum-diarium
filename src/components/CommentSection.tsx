import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2, AlertCircle, MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  userId?: string;
  authorName?: string;
  authorEmail?: string;
  content: string;
  parentId?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  postId: string;
  onCommentAdded?: () => void;
}

export function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const [deleteInputEmail, setDeleteInputEmail] = useState('');

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch comments: ${res.status}`);
        }

        const data = await res.json();
        setComments(data.comments || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load comments';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      setError('Bitte alle Felder ausfüllen.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to create comment: ${res.status}`);
      }

      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setAuthorName('');
      setAuthorEmail('');
      setContent('');

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create comment';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string, email: string) => {
    if (!email) {
      setError('E-Mail erforderlich, um einen Kommentar zu löschen');
      return;
    }

    setDeletingId(commentId);

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: commentId, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to delete comment: ${res.status}`);
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setDeleteDialogId(null);
      setDeleteInputEmail('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-violet-500', 'bg-rose-500',
      'bg-amber-500', 'bg-emerald-500', 'bg-cyan-500',
      'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-10 mt-14 pt-14 border-t border-border/30">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">Diskussion</h3>
          <p className="text-sm text-muted-foreground">{comments.length} {comments.length === 1 ? 'Kommentar' : 'Kommentare'}</p>
        </div>
      </div>

      {/* Comment Form */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-none rounded-2xl overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-foreground mb-5">Kommentar schreiben</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author-name" className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold">Name</Label>
                <Input
                  id="author-name"
                  type="text"
                  placeholder="Dein Name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={isSubmitting}
                  maxLength={100}
                  className="rounded-xl border-border/60 bg-background focus-visible:border-primary/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author-email" className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold">E-Mail <span className="text-muted-foreground/60 normal-case tracking-normal">(nicht öffentlich)</span></Label>
                <Input
                  id="author-email"
                  type="email"
                  placeholder="E-Mail-Adresse eingeben"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl border-border/60 bg-background focus-visible:border-primary/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment-content" className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold">Kommentar</Label>
              <Textarea
                id="comment-content"
                placeholder="Teile deine Gedanken zu diesem Beitrag..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                maxLength={5000}
                className="min-h-[130px] resize-y rounded-xl border-border/60 bg-background px-4 py-3 text-[0.95rem] leading-relaxed placeholder:text-muted-foreground/60 focus-visible:border-primary/60"
              />
              <p className="text-xs text-muted-foreground/60 text-right">
                {content.length}/5000 Zeichen
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !authorName.trim() || !authorEmail.trim() || !content.trim()}
              className="rounded-xl gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird veröffentlicht...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Kommentar veröffentlichen
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="font-medium">Noch keine Kommentare</p>
          <p className="text-sm mt-1 text-muted-foreground/70">Sei der Erste und starte die Diskussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="group flex gap-4">
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarColor(comment.authorName || 'A')} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                {getInitials(comment.authorName || 'A')}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="rounded-2xl rounded-tl-sm border border-border/40 bg-card/60 backdrop-blur-sm px-5 py-4 shadow-sm group-hover:border-border/70 transition-colors">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div>
                      <span className="font-semibold text-foreground text-sm">{comment.authorName}</span>
                      <span className="mx-2 text-border">·</span>
                      <span className="text-xs text-muted-foreground/70">{formatDate(comment.createdAt)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteDialogId(comment.id);
                        setDeleteInputEmail('');
                      }}
                      disabled={deletingId === comment.id}
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 rounded-lg"
                      title="Kommentar löschen"
                    >
                      {deletingId === comment.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>

                {/* Delete confirmation */}
                {deleteDialogId === comment.id && (
                  <div className="mt-2 ml-2 p-4 border border-destructive/30 rounded-xl bg-destructive/5 space-y-3">
                    <p className="text-sm font-semibold text-foreground">Kommentar löschen?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Gib die E-Mail-Adresse ein, mit der du kommentiert hast.</p>
                    <Input
                      type="email"
                      placeholder="E-Mail-Adresse eingeben"
                      value={deleteInputEmail}
                      onChange={(e) => setDeleteInputEmail(e.target.value)}
                      disabled={deletingId === comment.id}
                      className="text-sm rounded-lg h-9"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-lg h-8 text-xs"
                        onClick={() => handleDelete(comment.id, deleteInputEmail)}
                        disabled={deletingId === comment.id || !deleteInputEmail.trim()}
                      >
                        {deletingId === comment.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        Löschen
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-lg h-8 text-xs"
                        onClick={() => { setDeleteDialogId(null); setDeleteInputEmail(''); }}
                        disabled={deletingId === comment.id}
                      >
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
