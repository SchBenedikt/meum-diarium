import { sql } from 'drizzle-orm';
import { getDb } from '../db/client';
import { comments, posts } from '../db/schema';

async function ensurePostReference(db: ReturnType<typeof getDb>, env: any, requestUrl: URL, postId: string): Promise<boolean> {
  const existing = await db.select({ id: posts.id }).from(posts).where(sql`${posts.id} = ${postId}`).limit(1);
  if (existing.length > 0) return true;

  // Posts are versioned JSON assets. Create a D1 reference row on first comment
  // so the comments table's foreign key works even when no CMS copy exists.
  const indexUrl = new URL('/posts/index.json', requestUrl.origin);
  const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
  if (!indexResponse.ok) return false;

  const index = await indexResponse.json() as { posts?: Array<{ id?: string; author?: string; slug?: string; title?: string; excerpt?: string; date?: string; historicalDate?: string; historicalYear?: number; readingTime?: number; tags?: string[]; coverImage?: string }> };
  const indexedPost = index.posts?.find((post) => post.id === postId && post.author && post.slug);
  if (!indexedPost?.author || !indexedPost.slug) return false;

  const postUrl = new URL(`/posts/${encodeURIComponent(indexedPost.author)}/${encodeURIComponent(indexedPost.slug)}.json`, requestUrl.origin);
  const postResponse = await env.ASSETS.fetch(new Request(postUrl));
  if (!postResponse.ok) return false;
  const sourcePost = await postResponse.json() as { id?: string; title?: string; excerpt?: string; date?: string; historicalDate?: string; historicalYear?: number; readingTime?: number; tags?: string[]; coverImage?: string; content?: unknown; translations?: unknown };
  if (sourcePost.id !== postId || !sourcePost.title || !sourcePost.content) return false;

  await db.insert(posts).values({
    id: postId,
    slug: indexedPost.slug,
    authorId: null,
    title: sourcePost.title,
    excerpt: sourcePost.excerpt || indexedPost.excerpt || null,
    historicalDate: sourcePost.historicalDate || indexedPost.historicalDate || null,
    historicalYear: sourcePost.historicalYear ?? indexedPost.historicalYear ?? null,
    date: sourcePost.date || indexedPost.date || null,
    readingTime: sourcePost.readingTime ?? indexedPost.readingTime ?? null,
    tags: sourcePost.tags || indexedPost.tags || [],
    coverImage: sourcePost.coverImage || indexedPost.coverImage || null,
    content: sourcePost.content,
    translations: sourcePost.translations ?? null,
  }).onConflictDoNothing();

  const persisted = await db.select({ id: posts.id }).from(posts).where(sql`${posts.id} = ${postId}`).limit(1);
  return persisted.length > 0;
}

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

export const onRequest = async ({ request, env }: { request: Request; env: any }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const db = getDb(env);
  const url = new URL(request.url);

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

      const safeComments = commentsList.map(({ authorEmail: _, ...rest }) => rest);

      return new Response(JSON.stringify({ comments: safeComments }), {
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

    // Verify the post exists in D1 or seed its reference from the local JSON source.
    try {
      if (!await ensurePostReference(db, env, url, postId)) {
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
      const commentId = crypto.randomUUID();
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

  // DELETE /api/comments - Soft delete a comment (only by author's email or admin)
  if (request.method === 'DELETE') {
    let deleteBody: { id?: string; email?: string } | null = null;
    try {
      deleteBody = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    const commentId = String(deleteBody?.id || '').trim();
    const authorEmail = String(deleteBody?.email || '').trim();

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
