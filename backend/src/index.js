'use strict';

module.exports = function bootstrap({ strapi }) {
  const { compressUploadAudioFile, isAudioFile } = require('./utils/audio-compression');

  const minSizeKB = Number(process.env.AUDIO_MIN_SIZE_KB ?? 1024); // default: 1MB
  const bitrateKbps = Number(process.env.AUDIO_BITRATE_KBPS ?? 80);
  const channels = Number(process.env.AUDIO_CHANNELS ?? 1);
  const sampleRate = Number(process.env.AUDIO_SAMPLE_RATE ?? 22050);

  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    async afterCreate(event) {
      const file = event?.result;
      if (!file) return;

      // Only touch local audio. Never block the upload request.
      if (file.provider !== 'local') return;
      if (!isAudioFile(file)) return;

      // Fire-and-forget: heavy work runs after response.
      setImmediate(() => {
        compressUploadAudioFile(strapi, file, {
          minSizeKB,
          bitrateKbps,
          channels,
          sampleRate,
        }).catch((e) => {
          strapi.log.error(`Audio compression failed for file ${file.id}: ${e.message}`);
        });
      });
    },
  });
};
