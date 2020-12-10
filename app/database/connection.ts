import knex from "knex";

import { Config } from "~/config";

export const createKnex = (opts: { config: Config }) =>
  knex(getConnection({ config: opts.config }));

export const getConnection = (opts: { config: Config }) => ({
  client: opts.config.databaseType,
  connection: {
    host: opts.config.databaseHost,
    user: opts.config.databaseUser,
    port: opts.config.databasePort,
    password: opts.config.databasePassword,
    database: opts.config.databaseDatabaseName,
  },
  migrations: {
    directory: "./migrations",
  },
  useNullAsDefault: true,
});
