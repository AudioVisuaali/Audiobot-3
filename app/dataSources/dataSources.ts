import { CreateDataSourceOptions } from "./DataSourceWithContext";
import { ServerDataSource } from "./ServerDataSource";

import { UserDataSource } from "~/dataSources/UserDataSource";

export type DataSources = {
  userDS: UserDataSource;
  serverDS: ServerDataSource;
};

export const createDataSources = (
  opts: CreateDataSourceOptions,
): DataSources => ({
  userDS: new UserDataSource(opts),
  serverDS: new ServerDataSource(opts),
});
