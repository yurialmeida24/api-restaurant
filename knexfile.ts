import { afterEach } from "node:test";

export default {
  client: "sqlite3",
  connection: {
    filename: "./src/database/database.db"
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (connection: any, done: any) => {
      connection.run("PRAGMA foreign_keys = ON")
      done()
    },
  },
  migrations: {
    extensions: "ts",
    directory: "./src/database/migrations"
  },
  seeds: {
    extensions: "ts",
    directory: "./src/database/seeds"
  },
}