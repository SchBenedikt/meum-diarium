import { onRequest as __api_vocab__vokId__form__form__index_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/vocab/[vokId]/form/[form]/index.ts"
import { onRequest as __api_posts__author___slug__ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/posts/[author]/[slug].ts"
import { onRequestPost as __api_auth_login_ts_onRequestPost } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/auth/login.ts"
import { onRequestPost as __api_auth_register_ts_onRequestPost } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/auth/register.ts"
import { onRequestGet as __api_dashboard_stats_ts_onRequestGet } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/dashboard/stats.ts"
import { onRequest as __api_vocab_all_index_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/vocab/all/index.ts"
import { onRequest as __api_vocab__vokId__ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/vocab/[vokId].ts"
import { onRequestGet as __api_health_ts_onRequestGet } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/health.ts"
import { onRequestGet as __api_reading_progress_ts_onRequestGet } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/reading-progress.ts"
import { onRequestPost as __api_reading_progress_ts_onRequestPost } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/reading-progress.ts"
import { onRequest as __api_about_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/about.ts"
import { onRequest as __api_ask_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/ask.ts"
import { onRequest as __api_authors_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/authors.ts"
import { onRequest as __api_catalog_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/catalog.ts"
import { onRequest as __api_comments_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/comments.ts"
import { onRequest as __api_debug_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/debug.ts"
import { onRequest as __api_debug_bindings_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/debug-bindings.ts"
import { onRequest as __api_explain_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/explain.ts"
import { onRequest as __api_latin_texts_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/latin-texts.ts"
import { onRequest as __api_lexicon_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/lexicon.ts"
import { onRequest as __api_pages_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/pages.ts"
import { onRequest as __api_posts_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/posts.ts"
import { onRequest as __api_posts_json_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/posts-json.ts"
import { onRequest as __api_profile_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/profile.ts"
import { onRequest as __api_simulate_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/simulate.ts"
import { onRequest as __api_stats_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/stats.ts"
import { onRequest as __api_tags_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/tags.ts"
import { onRequest as __api_vocab_index_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/vocab/index.ts"
import { onRequest as __api_vocabulary_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/vocabulary.ts"
import { onRequest as __api_works_ts_onRequest } from "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/functions/api/works.ts"

export const routes = [
    {
      routePath: "/api/vocab/:vokId/form/:form",
      mountPath: "/api/vocab/:vokId/form/:form",
      method: "",
      middlewares: [],
      modules: [__api_vocab__vokId__form__form__index_ts_onRequest],
    },
  {
      routePath: "/api/posts/:author/:slug",
      mountPath: "/api/posts/:author",
      method: "",
      middlewares: [],
      modules: [__api_posts__author___slug__ts_onRequest],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_ts_onRequestPost],
    },
  {
      routePath: "/api/dashboard/stats",
      mountPath: "/api/dashboard",
      method: "GET",
      middlewares: [],
      modules: [__api_dashboard_stats_ts_onRequestGet],
    },
  {
      routePath: "/api/vocab/all",
      mountPath: "/api/vocab/all",
      method: "",
      middlewares: [],
      modules: [__api_vocab_all_index_ts_onRequest],
    },
  {
      routePath: "/api/vocab/:vokId",
      mountPath: "/api/vocab",
      method: "",
      middlewares: [],
      modules: [__api_vocab__vokId__ts_onRequest],
    },
  {
      routePath: "/api/health",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_health_ts_onRequestGet],
    },
  {
      routePath: "/api/reading-progress",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_reading_progress_ts_onRequestGet],
    },
  {
      routePath: "/api/reading-progress",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_reading_progress_ts_onRequestPost],
    },
  {
      routePath: "/api/about",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_about_ts_onRequest],
    },
  {
      routePath: "/api/ask",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_ask_ts_onRequest],
    },
  {
      routePath: "/api/authors",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_authors_ts_onRequest],
    },
  {
      routePath: "/api/catalog",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_catalog_ts_onRequest],
    },
  {
      routePath: "/api/comments",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_comments_ts_onRequest],
    },
  {
      routePath: "/api/debug",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_debug_ts_onRequest],
    },
  {
      routePath: "/api/debug-bindings",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_debug_bindings_ts_onRequest],
    },
  {
      routePath: "/api/explain",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_explain_ts_onRequest],
    },
  {
      routePath: "/api/latin-texts",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_latin_texts_ts_onRequest],
    },
  {
      routePath: "/api/lexicon",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_lexicon_ts_onRequest],
    },
  {
      routePath: "/api/pages",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_pages_ts_onRequest],
    },
  {
      routePath: "/api/posts",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_posts_ts_onRequest],
    },
  {
      routePath: "/api/posts-json",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_posts_json_ts_onRequest],
    },
  {
      routePath: "/api/profile",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_profile_ts_onRequest],
    },
  {
      routePath: "/api/simulate",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_simulate_ts_onRequest],
    },
  {
      routePath: "/api/stats",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_stats_ts_onRequest],
    },
  {
      routePath: "/api/tags",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_tags_ts_onRequest],
    },
  {
      routePath: "/api/vocab",
      mountPath: "/api/vocab",
      method: "",
      middlewares: [],
      modules: [__api_vocab_index_ts_onRequest],
    },
  {
      routePath: "/api/vocabulary",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_vocabulary_ts_onRequest],
    },
  {
      routePath: "/api/works",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_works_ts_onRequest],
    },
  ]