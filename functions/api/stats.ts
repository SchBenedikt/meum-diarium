import { getDb } from '../db/client';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const corsHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      }
    });
  }

  if (context.request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  const startTime = Date.now();

  try {
    // Check if D1 database is available
    if (!context.env?.DB) {
      console.error('❌ [Stats API] D1 database not available');
      return new Response(JSON.stringify({ 
        error: 'Database not configured',
        message: 'D1 database binding not found'
      }), {
        status: 503,
        headers: corsHeaders
      });
    }

    console.log('🔷 [Stats API] Fetching statistics from D1 database...');
    const db = getDb(context.env);

    // Calculate statistics from database
    const allPosts = await db.query.posts.findMany();
    const allAuthors = await db.query.authors.findMany();

    // Calculate stats
    const totalPosts = allPosts.length;
    const totalReadingTime = allPosts.reduce((sum, post: any) => 
      sum + (post.readingTime || 0), 0
    );
    const averageReadingTime = totalPosts > 0 
      ? Math.round(totalReadingTime / totalPosts) 
      : 0;

    // Count posts per author
    const postsByAuthor: Record<string, number> = {};
    allPosts.forEach((post: any) => {
      const author = post.author_id || post.authorId || 'unknown';
      postsByAuthor[author] = (postsByAuthor[author] || 0) + 1;
    });

    // Extract unique tags
    const tagCounts: Record<string, number> = {};
    allPosts.forEach((post: any) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          if (typeof tag === 'string') {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    const stats = {
      posts: totalPosts,
      authors: allAuthors.length,
      tags: Object.keys(tagCounts).length,
      totalReadingTime,
      averageReadingTime,
      postsByAuthor,
      topTags: Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count })),
      generatedAt: new Date().toISOString(),
    };

    const queryTime = Date.now() - startTime;
    console.log(`✅ [Stats API] Statistics generated successfully (${queryTime}ms)`);

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=3600',
        'X-Data-Source': 'cloudflare-d1'
      }
    });

  } catch (err: any) {
    const queryTime = Date.now() - startTime;
    console.error(`❌ [Stats API] Error (${queryTime}ms):`, err.message);
    console.error('   Stack:', err.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Database Error', 
      message: err.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};
