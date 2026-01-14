'use strict';

const path = require('node:path');
const fs = require('node:fs/promises');
const { spawn } = require('node:child_process');

let ffmpegPath;
try {
  // Optional dependency at runtime (but declared in package.json).
  // eslint-disable-next-line import/no-extraneous-dependencies
  ffmpegPath = require('ffmpeg-static');
} catch {
  ffmpegPath = null;
}

function isAudioFile(file) {
  const ext = (file.ext || '').toLowerCase();
  const mime = (file.mime || '').toLowerCase();
  if (mime.startsWith('audio/')) return true;
  return ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'].includes(ext);
}

function getPublicDir(strapi) {
  return strapi?.dirs?.static?.public || path.join(strapi.dirs.app.root, 'public');
}

function urlToAbsolutePath(strapi, url) {
  const publicDir = getPublicDir(strapi);
  const rel = String(url || '').replace(/^\//, '');
  return path.join(publicDir, rel);
}

function buildTargetPaths(strapi, baseHash) {
  const publicDir = getPublicDir(strapi);
  const uploadsDir = path.join(publicDir, 'uploads');

  const newHash = `${baseHash}_m${Date.now().toString(36)}`;
  const fileName = `${newHash}.mp3`;
  const absPath = path.join(uploadsDir, fileName);
  const url = `/uploads/${fileName}`;

  return { newHash, absPath, url };
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function transcodeToMobileMp3({ inputPath, outputPath, bitrateKbps = 80, channels = 1, sampleRate = 22050 }) {
  if (!ffmpegPath) {
    throw new Error('ffmpeg-static not available (ffmpegPath is null)');
  }

  const args = [
    '-i', inputPath,
    '-vn',
    '-ac', String(channels),
    '-ar', String(sampleRate),
    '-c:a', 'libmp3lame',
    '-b:a', `${bitrateKbps}k`,
    '-map_metadata', '-1',
    '-y',
    outputPath,
  ];

  await new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stderr = '';
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) return resolve();
      reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
    });
  });
}

/**
 * Compress a newly-uploaded Strapi file record IN PLACE by:
 * - transcoding audio to a smaller MP3
 * - updating the same file record to point at the new URL/hash
 * - deleting the original source file
 */
async function compressUploadAudioFile(strapi, file, options = {}) {
  const minSizeKB = Number(options.minSizeKB ?? 1024); // default: 1MB
  const bitrateKbps = Number(options.bitrateKbps ?? 80);
  const channels = Number(options.channels ?? 1);
  const sampleRate = Number(options.sampleRate ?? 22050);

  if (!file || !file.id) return { skipped: true, reason: 'missing file' };
  if (file.provider !== 'local') return { skipped: true, reason: 'non-local provider' };
  if (!isAudioFile(file)) return { skipped: true, reason: 'not audio' };

  const providerMeta = file.provider_metadata || {};
  if (providerMeta.audioCompressed === true) return { skipped: true, reason: 'already compressed' };

  // Strapi "size" is stored as KB (decimal).
  const sizeKB = Number(file.size || 0);
  if (sizeKB > 0 && sizeKB < minSizeKB) return { skipped: true, reason: 'below size threshold' };

  const sourcePath = urlToAbsolutePath(strapi, file.url);
  if (!(await fileExists(sourcePath))) {
    return { skipped: true, reason: `source file missing: ${sourcePath}` };
  }

  const { newHash, absPath: targetPath, url: targetUrl } = buildTargetPaths(strapi, file.hash);

  await transcodeToMobileMp3({
    inputPath: sourcePath,
    outputPath: targetPath,
    bitrateKbps,
    channels,
    sampleRate,
  });

  const stat = await fs.stat(targetPath);
  const newSizeKB = stat.size / 1024;

  // Remove original to save disk space.
  await fs.unlink(sourcePath);

  const newProviderMetadata = {
    ...providerMeta,
    audioCompressed: true,
    audioCompression: {
      bitrateKbps,
      channels,
      sampleRate,
      compressedAt: new Date().toISOString(),
      source: {
        url: file.url,
        hash: file.hash,
        ext: file.ext,
        mime: file.mime,
        sizeKB: sizeKB || null,
      },
    },
  };

  const updated = await strapi.entityService.update('plugin::upload.file', file.id, {
    data: {
      hash: newHash,
      ext: '.mp3',
      mime: 'audio/mpeg',
      url: targetUrl,
      size: newSizeKB,
      formats: null,
      provider_metadata: newProviderMetadata,
    },
  });

  return { skipped: false, updated };
}

module.exports = {
  compressUploadAudioFile,
  isAudioFile,
};
