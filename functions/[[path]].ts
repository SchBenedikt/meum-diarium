// Cloudflare Pages Function for serving static assets
export async function onRequest(context: any) {
  return context.env.ASSETS.fetch(context.request);
}
