import { getDb } from '../db/client';
import { comments } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PagesContext } from '../types';

// Helper function to generate comment ID
function generateCommentId(): string {
    return 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');

    if (!postId) {
        return new Response(
            JSON.stringify({ error: 'Post ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const db = getDb(env);

        // Get comments for the post
        const commentsData = await db
            .select({
                id: comments.id,
                postId: comments.postId,
                authorName: comments.authorName,
                content: comments.content,
                createdAt: comments.createdAt,
                updatedAt: comments.updatedAt,
                isEdited: comments.isEdited,
                isDeleted: comments.isDeleted,
                likesCount: comments.likesCount,
            })
            .from(comments)
            .where(eq(comments.postId, postId) && eq(comments.isDeleted, false))
            .orderBy(desc(comments.createdAt));

        return new Response(
            JSON.stringify({ comments: commentsData }),
            { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Get comments error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;
    
    try {
        const { postId, content, authorName } = await request.json() as {
            postId: string;
            content: string;
            authorName?: string;
        };

        // Validation
        if (!postId || !content || content.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Post ID and content are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!authorName || authorName.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Author name is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (content.length > 2000) {
            return new Response(
                JSON.stringify({ error: 'Comment too long (max 2000 characters)' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb(env);
        const commentId = generateCommentId();
        const now = new Date().toISOString();

        // Create comment
        const newComment = {
            id: commentId,
            postId,
            authorName: authorName.trim(),
            content: content.trim(),
            createdAt: now,
            updatedAt: now,
            isEdited: false,
            isDeleted: false,
            likesCount: 0,
        };

        await db.insert(comments).values(newComment);

        return new Response(
            JSON.stringify({
                message: 'Comment created successfully',
                comment: newComment
            }),
            { 
                status: 201, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Create comment error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
