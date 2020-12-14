import { BotInfoDataSource } from "~/dataSources/BotInfoDataSource";
import { CurrencyHistoryDataSource } from "~/dataSources/CurrencyHistoryDataSource";
import { CreateDataSourceOptions } from "~/dataSources/DataSourceWithContext";
import { GuildDataSource } from "~/dataSources/GuildDataSource";
import { UserDataSource } from "~/dataSources/UserDataSource";

export type DataSources = {
  userDS: UserDataSource;
  guildDS: GuildDataSource;
  currencyHistoryDS: CurrencyHistoryDataSource;
  botInfoDS: BotInfoDataSource;
};

export const createDataSources = (
  opts: CreateDataSourceOptions,
): DataSources => ({
  userDS: new UserDataSource(opts),
  guildDS: new GuildDataSource(opts),
  currencyHistoryDS: new CurrencyHistoryDataSource(opts),
  botInfoDS: new BotInfoDataSource(opts),
});
