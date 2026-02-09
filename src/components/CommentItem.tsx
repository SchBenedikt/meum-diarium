import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Reply, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { CommentForm } from './CommentForm';

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

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const { user, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Ensure valid date
    if (isNaN(date.getTime())) {
      return 'Unbekanntes Datum';
    }
    
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
      return 'gerade eben';
    } else if (diffInMinutes < 60) {
      return `vor ${diffInMinutes} Minute${diffInMinutes !== 1 ? 'n' : ''}`;
    } else if (diffInHours < 24) {
      return `vor ${diffInHours} Stunde${diffInHours !== 1 ? 'n' : ''}`;
    } else if (diffInDays === 1) {
      return 'gestern';
    } else if (diffInDays < 7) {
      return `vor ${diffInDays} Tagen`;
    } else {
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getUserInitials = (displayName: string) => {
    return displayName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isGuest = comment.user?.username === 'guest' || comment.userId.startsWith('guest_');

  const handleLike = async () => {
    if (!user || isSubmittingLike) return;
    
    setIsSubmittingLike(true);
    try {
      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsSubmittingLike(false);
    }
  };

  const handleReply = async (content: string) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          postId: comment.postId,
          content,
          parentId: comment.id,
        }),
      });

      if (response.ok) {
        setShowReplyForm(false);
        // Trigger parent refresh
        window.location.reload();
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  return (
    <div className={`space-y-3 ${isReply ? 'ml-4' : ''}`}>
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          {comment.user?.avatarUrl ? (
            <AvatarImage src={comment.user.avatarUrl} alt={comment.user.displayName} />
          ) : (
            <AvatarFallback className={isGuest ? 'bg-muted' : 'bg-primary/10 text-primary'}>
              {comment.user ? getUserInitials(comment.user.displayName) : '?'}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.user?.displayName || 'Unbekannter Benutzer'}
            </span>
            
            {isGuest && (
              <Badge variant="secondary" className="text-xs">
                Gast
              </Badge>
            )}
            
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
            
            {comment.isEdited && (
              <span className="text-xs text-muted-foreground italic">
                (bearbeitet)
              </span>
            )}
          </div>

          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 text-xs ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={handleLike}
              disabled={!user || isSubmittingLike}
            >
              <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount > 0 && likesCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Antworten
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem className="text-xs">
                  Melden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 ml-4">
              <CommentForm
                onSubmit={handleReply}
                isSubmitting={false}
                placeholder={`Antworten Sie auf ${comment.user?.displayName || 'diesen Kommentar'}...`}
                submitButtonText="Antworten"
                onCancel={() => setShowReplyForm(false)}
                showCancel={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
