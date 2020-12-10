import Logger from "bunyan";

import { DataSources } from "./dataSources/dataSources";
import { DataLoaders } from "./dataloaders/dataLoaders";
import { Services } from "./services/services";
import { Utils } from "./utils/utils";

export type Context = {
  logger: Logger;
  utils: Utils;
  services: Services;
  dataSources: DataSources;
  dataLoaders: DataLoaders;
};

export const createContext = (opts: Context): Context => ({
  logger: opts.logger,
  utils: opts.utils,
  services: opts.services,
  dataSources: opts.dataSources,
  dataLoaders: opts.dataLoaders,
});
