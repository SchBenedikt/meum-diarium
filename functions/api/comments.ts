import { getDb } from '../db/client';
import { comments, users, userCommentingActivity } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PagesContext } from '../types';

// Helper function to generate comment ID
function generateCommentId(): string {
    return 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Helper function to verify JWT token (simplified version)
function verifyToken(token: string): string | null {
    try {
        const [, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        return decoded.userId;
    } catch {
        return null;
    }
}

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://4ae78071.meum-diarium.pages.dev',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
    'Content-Type': 'application/json'
};

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;
    const method = request.method;
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');

    // Handle OPTIONS preflight requests
    if (method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: corsHeaders
        });
    }

    // GET comments for a post
    if (method === 'GET') {
        if (!postId) {
            return new Response(
                JSON.stringify({ error: 'Post ID is required' }),
                { status: 400, headers: corsHeaders }
            );
        }

        try {
            const db = getDb(env);

            // Get comments for post with user info
            const commentsData = await db
                .select({
                    id: comments.id,
                    postId: comments.postId,
                    userId: comments.userId,
                    parentId: comments.parentId,
                    content: comments.content,
                    createdAt: comments.createdAt,
                    updatedAt: comments.updatedAt,
                    isEdited: comments.isEdited,
                    isDeleted: comments.isDeleted,
                    likesCount: comments.likesCount,
                    user: {
                        displayName: users.displayName,
                        username: users.username,
                        avatarUrl: users.avatarUrl,
                    }
                })
                .from(comments)
                .leftJoin(users, eq(comments.userId, users.id))
                .where(eq(comments.postId, postId) && eq(comments.isDeleted, false))
                .orderBy(desc(comments.createdAt));

            return new Response(
                JSON.stringify({ comments: commentsData }),
                { 
                    status: 200, 
                    headers: corsHeaders
                }
            );

        } catch (error) {
            console.error('Get comments error:', error);
            return new Response(
                JSON.stringify({ error: 'Internal server error' }),
                { status: 500, headers: corsHeaders }
            );
        }
    }

    // POST create a new comment
    if (method === 'POST') {
        try {
            const { postId, content, parentId, authorName, authorEmail } = await request.json() as {
                postId: string;
                content: string;
                parentId?: string;
                authorName?: string;
                authorEmail?: string;
            };

            // Validation
            if (!postId || !content || content.trim().length === 0) {
                return new Response(
                    JSON.stringify({ error: 'Post ID and content are required' }),
                    { status: 400, headers: corsHeaders }
                );
            }

            if (content.length > 2000) {
                return new Response(
                    JSON.stringify({ error: 'Comment too long (max 2000 characters)' }),
                    { status: 400, headers: corsHeaders }
                );
            }

            const db = getDb(env);
            let userId: string | null = null;

            // Check if user is authenticated
            const authHeader = request.headers.get('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                userId = verifyToken(token);
            }

            // For non-authenticated users, require name and email
            if (!userId && (!authorName || !authorEmail)) {
                return new Response(
                    JSON.stringify({ 
                        error: 'Name and email are required for guest comments',
                        requiresAuth: false,
                        needsGuestInfo: true
                    }),
                    { status: 400, headers: corsHeaders }
                );
            }

            const commentId = generateCommentId();
            const now = new Date().toISOString();

            // Create comment
            const newComment = {
                id: commentId,
                postId,
                userId: userId || ('guest_' + commentId), // Use special guest ID
                parentId: parentId || undefined,
                content: content.trim(),
                createdAt: now,
                updatedAt: now,
                isEdited: false,
                isDeleted: false,
                likesCount: 0,
            };

            await db.insert(comments).values(newComment);

            // Track comment activity for authenticated users
            if (userId) {
                const activityId = 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                await db.insert(userCommentingActivity).values({
                    id: activityId,
                    userId,
                    commentId,
                    action: 'created',
                    createdAt: now,
                    metadata: JSON.stringify({ 
                        postId,
                        parentId: parentId || null,
                        isGuest: false
                    })
                });
            }

            // Return comment with user info
            let commentResponse: any = {
                ...newComment,
                user: userId ? null : {
                    displayName: authorName,
                    username: 'guest',
                    avatarUrl: null,
                }
            };

            // If authenticated user, get user info
            if (userId) {
                const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
                if (userRecords.length > 0) {
                    const user = userRecords[0];
                    commentResponse.user = {
                        displayName: user.displayName,
                        username: user.username,
                        avatarUrl: user.avatarUrl,
                    };
                }
            }

            return new Response(
                JSON.stringify({
                    message: 'Comment created successfully',
                    comment: commentResponse,
                    isGuest: !userId
                }),
                { 
                    status: 201, 
                    headers: corsHeaders
                }
            );

        } catch (error) {
            console.error('Create comment error:', error);
            return new Response(
                JSON.stringify({ error: 'Internal server error' }),
                { status: 500, headers: corsHeaders }
            );
        }
    }

    // Method not allowed
    return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
    );
};
