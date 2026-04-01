import { sql } from 'drizzle-orm';
import { getDb } from '../db/client';
import { comments, posts } from '../db/schema';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
};

const jsonHeaders = {
  'content-type': 'application/json',
  ...corsHeaders,
};

interface CommentPayload {
  postId?: string;
  content?: string;
  authorName?: string;
  authorEmail?: string;
  parentId?: string;
}

interface CommentResponse {
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

export const onRequest = async ({ request, params, env }: { request: Request; params: Record<string, string>; env: any }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const db = getDb(env);
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  // GET /api/comments?postId=:postId - Get all comments for a post
  if (request.method === 'GET') {
    const postId = url.searchParams.get('postId');
    
    if (!postId) {
      return new Response(JSON.stringify({ error: 'Missing postId parameter' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    try {
      const commentsList = await db
        .select()
        .from(comments)
        .where(sql`${comments.postId} = ${postId} AND ${comments.isDeleted} = 0`)
        .orderBy(sql`${comments.createdAt} DESC`);

      return new Response(JSON.stringify({ comments: commentsList }), {
        status: 200,
        headers: jsonHeaders,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch comments';
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: jsonHeaders,
      });
    }
  }

  // POST /api/comments - Create a new comment
  if (request.method === 'POST') {
    let body: CommentPayload | null = null;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    const postId = String(body?.postId || '').trim();
    const content = String(body?.content || '').trim();
    const authorName = String(body?.authorName || '').trim();
    const authorEmail = String(body?.authorEmail || '').trim();
    const parentId = body?.parentId ? String(body.parentId).trim() : undefined;

    if (!postId) {
      return new Response(JSON.stringify({ error: 'Missing postId' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    if (!content || content.length < 3 || content.length > 5000) {
      return new Response(JSON.stringify({ error: 'Content must be between 3 and 5000 characters' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    if (!authorName || authorName.length < 2 || authorName.length > 100) {
      return new Response(JSON.stringify({ error: 'Author name must be between 2 and 100 characters' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    if (!authorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
      return new Response(JSON.stringify({ error: 'Valid email address required' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    // Verify post exists
    try {
      const post = await db
        .select()
        .from(posts)
        .where(sql`${posts.id} = ${postId}`)
        .limit(1);

      if (!post || post.length === 0) {
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: jsonHeaders,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to verify post';
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    // Create comment
    try {
      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const newComment: Omit<CommentResponse, 'id' | 'createdAt' | 'updatedAt'> & {
        id: string;
        createdAt: string;
        updatedAt: string;
      } = {
        id: commentId,
        postId,
        authorName,
        authorEmail,
        content,
        parentId,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(comments).values(newComment);

      return new Response(JSON.stringify({ comment: newComment }), {
        status: 201,
        headers: jsonHeaders,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create comment';
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: jsonHeaders,
      });
    }
  }

  // DELETE /api/comments/:id - Soft delete a comment (only by author's email or admin)
  if (request.method === 'DELETE') {
    const commentId = url.searchParams.get('id');
    const authorEmail = url.searchParams.get('email');

    if (!commentId || !authorEmail) {
      return new Response(JSON.stringify({ error: 'Missing commentId or email' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    try {
      // Verify comment exists and belongs to author
      const comment = await db
        .select()
        .from(comments)
        .where(sql`${comments.id} = ${commentId}`)
        .limit(1);

      if (!comment || comment.length === 0) {
        return new Response(JSON.stringify({ error: 'Comment not found' }), {
          status: 404,
          headers: jsonHeaders,
        });
      }

      if (comment[0].authorEmail !== authorEmail) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 403,
          headers: jsonHeaders,
        });
      }

      // Soft delete
      await db
        .update(comments)
        .set({ isDeleted: true, updatedAt: new Date().toISOString() })
        .where(sql`${comments.id} = ${commentId}`);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: jsonHeaders,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete comment';
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: jsonHeaders,
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: jsonHeaders,
  });
};
