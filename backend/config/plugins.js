module.exports = ({ env }) => ({
  // Upload plugin configuration
  upload: {
    config: {
      sizeLimit: 50 * 1024 * 1024, // 50MB for audio files
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
    },
  },
});
