// Database configuration
// SQLite for local development, Strapi Cloud handles production DB

module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: env('DATABASE_FILENAME', '.tmp/data.db'),
    },
    useNullAsDefault: true,
    pool: {
      min: 0,
      max: 1,
    },
  },
});
