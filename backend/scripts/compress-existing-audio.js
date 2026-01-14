'use strict';

const { createStrapi } = require('@strapi/strapi');
const { compressUploadAudioFile, isAudioFile } = require('../src/utils/audio-compression');

function getCompressionOptionsFromEnv() {
  return {
    minSizeKB: Number(process.env.AUDIO_MIN_SIZE_KB ?? 1024),
    bitrateKbps: Number(process.env.AUDIO_BITRATE_KBPS ?? 80),
    channels: Number(process.env.AUDIO_CHANNELS ?? 1),
    sampleRate: Number(process.env.AUDIO_SAMPLE_RATE ?? 22050),
  };
}

async function fetchFilePage(strapi, page, pageSize) {
  return strapi.entityService.findMany('plugin::upload.file', {
    filters: { provider: 'local' },
    sort: { createdAt: 'asc' },
    limit: pageSize,
    start: (page - 1) * pageSize,
  });
}

function shouldCompress(file) {
  const meta = file.provider_metadata || {};
  if (meta.audioCompressed === true) return false;
  return isAudioFile(file);
}

async function compressOne(strapi, file, options) {
  const res = await compressUploadAudioFile(strapi, file, options);
  if (!res.skipped) {
    strapi.log.info(`Compressed file ${file.id} -> ${res.updated.url}`);
    return true;
  }
  return false;
}

async function main() {
  const strapi = await createStrapi().load();
  const options = getCompressionOptionsFromEnv();

  const pageSize = 100;
  let page = 1;
  let processed = 0;
  let compressed = 0;

  strapi.log.info(`Compressing existing audio uploads (minSizeKB=${options.minSizeKB}, bitrate=${options.bitrateKbps}k)...`);

  while (true) {
    const results = await fetchFilePage(strapi, page, pageSize);
    if (!results || results.length === 0) break;

    for (const file of results) {
      processed += 1;
      if (!shouldCompress(file)) continue;

      try {
        const didCompress = await compressOne(strapi, file, options);
        if (didCompress) compressed += 1;
      } catch (e) {
        strapi.log.error(`Failed to compress file ${file.id}: ${e.message}`);
      }
    }

    page += 1;
  }

  strapi.log.info(`Done. processed=${processed}, compressed=${compressed}`);
  await strapi.destroy();
}

(async () => {
  try {
    await main();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }
})();
