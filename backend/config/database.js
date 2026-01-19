// Database configuration
// - Defaults to SQLite for local development
// - Uses Strapi Cloud / production DB settings when env vars are provided

module.exports = function databaseConfig({ env }) {
  const client = env('DATABASE_CLIENT', 'sqlite');

  const isSqlite = client === 'sqlite';

  return {
    connection: {
      client,
      connection: isSqlite
        ? {
            filename: env('DATABASE_FILENAME', '.tmp/data.db'),
          }
        : {
            host: env('DATABASE_HOST', '127.0.0.1'),
            port: env.int('DATABASE_PORT', 5432),
            database: env('DATABASE_NAME', 'strapi'),
            user: env('DATABASE_USERNAME', 'strapi'),
            password: env('DATABASE_PASSWORD', 'strapi'),
            schema: env('DATABASE_SCHEMA', 'public'),
            ssl: env.bool('DATABASE_SSL', false)
              ? {
                  rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
                }
              : false,
          },
      useNullAsDefault: isSqlite,
      pool: isSqlite
        ? {
            min: 0,
            max: 1,
          }
        : {
            min: env.int('DATABASE_POOL_MIN', 2),
            max: env.int('DATABASE_POOL_MAX', 10),
          },
    },
  };
};
