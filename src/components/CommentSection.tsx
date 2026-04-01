import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2, AlertCircle } from 'lucide-react';

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
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      setError('Please fill in all fields');
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
      setComments([data.comment, ...comments]);
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
      setError('Email required to delete comment');
      return;
    }

    setDeletingId(commentId);

    try {
      const res = await fetch(`/api/comments?id=${encodeURIComponent(commentId)}&email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to delete comment: ${res.status}`);
      }

      setComments(comments.filter((c) => c.id !== commentId));
      setDeleteEmail('');
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

  return (
    <div className="space-y-8 border-t border-primary/20 pt-8">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">Diskussion ({comments.length})</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Teile deine Gedanken zu diesem Beitrag. Alle Kommentare werden moderiert.
        </p>

        {/* Comment Form */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author-name">Name</Label>
                  <Input
                    id="author-name"
                    type="text"
                    placeholder="Dein Name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    disabled={isSubmitting}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author-email">E-Mail</Label>
                  <Input
                    id="author-email"
                    type="email"
                    placeholder="deine@email.com"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment-content">Dein Kommentar</Label>
                <Textarea
                  id="comment-content"
                  placeholder="Schreibe deinen Kommentar hier..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground">
                  {content.length}/5000 Zeichen
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !authorName.trim() || !authorEmail.trim() || !content.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  'Kommentar veröffentlichen'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Comments List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Noch keine Kommentare. Sei der Erste!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="border-border/50 bg-background/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{comment.authorName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const email = prompt(`Gib deine E-Mail ein, um diesen Kommentar zu löschen:\n\n${comment.authorEmail}`);
                        if (email) {
                          handleDelete(comment.id, email);
                        }
                      }}
                      disabled={deletingId === comment.id}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                    >
                      {deletingId === comment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
