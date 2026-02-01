import { getDb } from '../../../src/db/client';
import { latinTexts } from '../../../src/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const onRequest = async (context: any) => {
    const db = getDb(context.env);
    const url = new URL(context.request.url);

    const workId = url.searchParams.get('workId');
    const book = url.searchParams.get('book');
    const chapter = url.searchParams.get('chapter');

    // Validate inputs
    if (!workId || !book) {
        return new Response(JSON.stringify({ error: 'Missing workId or book parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const bookNum = parseInt(book);
        const chapterNum = chapter ? parseInt(chapter) : undefined;

        let whereClause;
        if (chapterNum !== undefined) {
            whereClause = and(
                eq(latinTexts.workId, workId),
                eq(latinTexts.book, bookNum),
                eq(latinTexts.chapter, chapterNum)
            );
        } else {
            whereClause = and(
                eq(latinTexts.workId, workId),
                eq(latinTexts.book, bookNum)
            );
        }

        const results = await db.query.latinTexts.findMany({
            where: whereClause,
            // Order by chapter, section, verse to ensure correct text flow
            orderBy: [asc(latinTexts.chapter), asc(latinTexts.section), asc(latinTexts.verse)]
        });

        return new Response(JSON.stringify(results), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Internal Error', message: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
