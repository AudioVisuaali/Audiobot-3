import Logger from "bunyan";

import { DataSources } from "./dataSources/dataSources";
import { Services } from "./services/services";

export type Context = {
  logger: Logger;
  services: Services;
  dataSources: DataSources;
};

export const createContext = (opts: Context): Context => ({
  logger: opts.logger,
  services: opts.services,
  dataSources: opts.dataSources,
});
