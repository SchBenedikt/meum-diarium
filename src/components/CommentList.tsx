import React from 'react';
import { CommentItem } from './CommentItem';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';

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

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
}

export function CommentList({ comments, isLoading = false }: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Kommentare werden geladen...</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-medium text-lg mb-2">Noch keine Kommentare</h3>
        <p className="text-muted-foreground">
          Seien Sie der Erste, der einen Kommentar schreibt!
        </p>
      </div>
    );
  }

  // Sort comments to show top-level comments first, then replies
  const topLevelComments = comments.filter(comment => !comment.parentId);
  const replies = comments.filter(comment => comment.parentId);

  // Group replies by parent ID
  const repliesByParent = replies.reduce((acc, reply) => {
    if (!acc[reply.parentId!]) {
      acc[reply.parentId!] = [];
    }
    acc[reply.parentId!].push(reply);
    return acc;
  }, {} as Record<string, Comment[]>);

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">
        {comments.length} {comments.length === 1 ? 'Kommentar' : 'Kommentare'}
      </h3>
      
      <div className="space-y-6">
        {topLevelComments.map((comment) => (
          <div key={comment.id}>
            <CommentItem comment={comment} />
            
            {/* Render replies */}
            {repliesByParent[comment.id] && repliesByParent[comment.id].length > 0 && (
              <div className="ml-4 sm:ml-8 mt-4 space-y-4 border-l-2 border-border/30 pl-4">
                {repliesByParent[comment.id].map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
