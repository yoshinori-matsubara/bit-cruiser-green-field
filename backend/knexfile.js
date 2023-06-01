// Update with your config settings.

require("dotenv").config({
  path: "./.env",
})
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "buying_list",
      user: process.env.DB_USER,
      // password: "password",
    },
    migrations: {
      directory: "./db/migrations",
      tableName: "knex_migrations",
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.query('SET timezone="UTC";', (err) => {
          done(err, conn);
        });
      },
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    // connection: "postgres://bitcruiser:QYEKng4qTz0UOoD5L9JpLHQLBxZPlZTY@dpg-chsc6rm7avjdbigldufg-a/buying_list",
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
