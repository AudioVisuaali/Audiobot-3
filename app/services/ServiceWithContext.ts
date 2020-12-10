import Logger from "bunyan";

import { Config } from "~/config";

export interface CreateServiceOptions {
  config: Config;
  logger: Logger;
}

export class ServiceWithContext {
  protected config: Config;
  protected logger: Logger;

  constructor(opts: CreateServiceOptions) {
    this.config = opts.config;
    this.logger = opts.logger;
  }
}
