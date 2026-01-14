module.exports = (config = {}, { strapi }) => {
  const maxAgeSeconds = Number(config.maxAgeSeconds ?? 31536000); // 1 year

  return async (ctx, next) => {
    await next();

    // Only set headers for successful static uploads.
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') return;
    if (!ctx.path.startsWith('/uploads/')) return;
    if (ctx.status !== 200) return;

    // Help browsers/players (especially mobile) re-use audio and seek efficiently.
    ctx.set('Cache-Control', `public, max-age=${maxAgeSeconds}, immutable`);

    // Koa's static sender usually handles ranges; this just makes intent explicit.
    if (!ctx.response.headers['accept-ranges']) {
      ctx.set('Accept-Ranges', 'bytes');
    }
  };
};
