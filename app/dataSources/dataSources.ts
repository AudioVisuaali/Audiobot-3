import { CreateDataSourceOptions } from "./DataSourceWithContext";
import { GuildDataSource } from "./GuildDataSource";

import { UserDataSource } from "~/dataSources/UserDataSource";

export type DataSources = {
  userDS: UserDataSource;
  guildDS: GuildDataSource;
};

export const createDataSources = (
  opts: CreateDataSourceOptions,
): DataSources => ({
  userDS: new UserDataSource(opts),
  guildDS: new GuildDataSource(opts),
});
