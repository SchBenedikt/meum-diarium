import type { D1Database } from '@cloudflare/workers-types';

// Type definitions for Cloudflare Pages Functions
export interface Env {
    DB: D1Database;
    vocab: D1Database;
    ASSETS: {
        fetch: (request: Request) => Promise<Response>;
    };
    [key: string]: any;
}

export interface PagesContext {
    request: Request;
    env: Env;
    params: Record<string, string>;
    waitUntil: (promise: Promise<any>) => void;
    next: () => Promise<Response>;
    data: Record<string, any>;
}

// Helper type for onRequest handlers
export type RequestHandler = (context: PagesContext) => Promise<Response> | Response;
