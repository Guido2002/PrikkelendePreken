'use strict';

module.exports = ({ strapi }) => ({
  async chapter(ctx) {
    const bibleId = ctx.query?.bibleId;
    const chapterId = ctx.query?.chapterId;

    // Do not cache scripture responses unless explicitly allowed.
    ctx.set('Cache-Control', 'no-store');

    try {
      const result = await strapi.service('api::bible.bible').fetchChapter({ bibleId, chapterId });
      ctx.body = result;
    } catch (err) {
      const status = err.status || 500;
      ctx.status = status;
      ctx.body = {
        error: err.message || 'Failed to fetch bible chapter',
      };
    }
  },
});
