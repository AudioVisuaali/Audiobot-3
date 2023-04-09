import Logger from "bunyan";
import { Knex } from "knex";

import { Config } from "../config";

export interface CreateDataSourceOptions {
  config: Config;
  logger: Logger;
  knex: Knex;
}

export class DataSourceWithContext {
  protected config: Config;
  protected logger: Logger;
  protected knex: Knex;

  constructor(opts: CreateDataSourceOptions) {
    this.config = opts.config;
    this.logger = opts.logger;
    this.knex = opts.knex;
  }
}
