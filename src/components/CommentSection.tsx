import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CommentForm } from '@/components/CommentForm';
import { CommentList } from '@/components/CommentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getApiBase } from '@/lib/api';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  likesCount: number;
  user?: {
    displayName: string;
    username: string;
    avatarUrl?: string;
  };
}

interface CommentSectionProps {
  postId: string;
  title?: string;
}

export function CommentSection({ postId, title = "Kommentare" }: CommentSectionProps) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [readingStartTime] = useState<number>(Date.now());

  // Track reading time on mount and unmount
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const readingTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
      if (readingTimeSeconds > 5) { // Only track if user read for more than 5 seconds
        trackReadingTime(postId, readingTimeSeconds);
      }
    };
  }, [postId]);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`${getApiBase()}/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        console.error('Error fetching comments:', response.status, response.statusText);
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Track reading time
  const trackReadingTime = async (postId: string, readingTimeSeconds: number) => {
    try {
      await fetch(`${getApiBase()}/api/reading-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'X-User-ID': user?.id || '',
        },
        body: JSON.stringify({
          postId,
          readingTimeSeconds,
          progressPercentage: 100, // Mark as 100% when user leaves
        }),
      });
    } catch (error) {
      console.error('Error tracking reading time:', error);
    }
  };

  // Handle new comment submission
  const handleCommentSubmit = async (content: string, guestData?: { name: string; email: string }) => {
    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth token if user is logged in
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const body: any = {
        postId,
        content,
      };

      // Add guest data if not logged in
      if (!user && guestData) {
        body.authorName = guestData.name;
        body.authorEmail = guestData.email;
      }

      const response = await fetch(`${getApiBase()}/api/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        // Add new comment to the list
        setComments(prev => [data.comment, ...prev]);
        
        // If it was a guest comment, hide the guest form
        if (!user) {
          setShowGuestForm(false);
        }
      } else {
        const errorData = await response.json();
        console.error('Error submitting comment:', errorData.error);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title} ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <div className="space-y-4">
          {user ? (
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Eingeloggt als <span className="font-medium">{user.displayName}</span>
              </div>
              <CommentForm
                onSubmit={handleCommentSubmit}
                isSubmitting={isSubmitting}
                placeholder="Schreiben Sie einen Kommentar..."
              />
            </div>
          ) : (
            <div className="space-y-4">
              {!showGuestForm ? (
                <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Möchten Sie einen Kommentar schreiben?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sie können als Gast kommentieren oder sich anmelden für die beste Erfahrung
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => setShowGuestForm(true)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Als Gast kommentieren
                    </Button>
                    <Button asChild className="flex items-center gap-2">
                      <Link to="/login">
                        <LogIn className="h-4 w-4" />
                        Anmelden für mehr Funktionen
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Als Gast kommentieren
                  </div>
                  <CommentForm
                    onSubmit={handleCommentSubmit}
                    isSubmitting={isSubmitting}
                    placeholder="Schreiben Sie einen Kommentar als Gast..."
                    showGuestFields={true}
                    onCancel={() => setShowGuestForm(false)}
                  />
                  <div className="mt-3 text-center">
                    <p className="text-sm text-muted-foreground">
                      Oder{' '}
                      <Link to="/login" className="text-primary hover:underline">
                        anmelden für mehr Funktionen
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comments List */}
        <CommentList comments={comments} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
