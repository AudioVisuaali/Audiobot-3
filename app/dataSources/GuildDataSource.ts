import DataLoader from "dataloader";
import { Snowflake } from "discord.js";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import {
  CreateDataSourceOptions,
  DataSourceWithContext,
} from "~/dataSources/DataSourceWithContext";
import { Table, GuildTableRaw } from "~/database/types";
import { Language } from "~/translations/formatter";
import { timeUtils } from "~/utils/timeUtils";

export type GuildTable = {
  id: number;
  uuid: string;
  discordId: Snowflake;
  prefix: string;
  language: Language | null;
  casinoChannelId: Snowflake | null;
  currencyPointsDisplayName: string | null;
  createdAt: DateTime;
  updatedAt: DateTime | null;
};

export class GuildDataSource extends DataSourceWithContext {
  public dataLoader: DataLoader<Snowflake, GuildTable | null>;

  constructor(opts: CreateDataSourceOptions) {
    super(opts);

    this.dataLoader = new DataLoader<Snowflake, GuildTable>(async (keys) => {
      const serverRows = await this.getGuilds({ guildDiscordIds: keys });

      const persons = serverRows.reduce<{ [key: string]: GuildTable }>(
        (prev, current) => ({ ...prev, [current.discordId]: current }),
        {},
      );

      return keys.map((key) => persons[key] ?? null);
    });
  }

  private async getGuilds(opts: { guildDiscordIds: readonly string[] }) {
    const guilds = await this.knex<GuildTableRaw>(Table.GUILDS).whereIn(
      "discordId",
      opts.guildDiscordIds,
    );

    return guilds.map(this.formatRow);
  }

  private formatRow(row: GuildTableRaw): GuildTable {
    return {
      id: row.id,
      uuid: row.uuid,
      discordId: row.discordId,
      prefix: row.prefix,
      language: row.language,
      casinoChannelId: row.casinoChannelId,
      currencyPointsDisplayName: row.currencyPointsDisplayName,
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: timeUtils.parseDBTime(row.updatedAt),
    };
  }

  public async getGuild(opts: { guildDiscordId: Snowflake }) {
    return await this.dataLoader.load(opts.guildDiscordId);
  }

  public async createGuild(opts: { guildDiscordId: Snowflake }) {
    const insertedGuilds = await this.knex<GuildTableRaw>(Table.GUILDS)
      .insert({
        uuid: uuidv4(),
        discordId: opts.guildDiscordId,
        prefix: this.config.bot.commandPrefixDefault,
      })
      .returning("*");

    if (insertedGuilds.length !== 1) {
      this.logger.error(`Could not create server: ${opts.guildDiscordId}`);
      throw new Error(`Could not create server: ${opts.guildDiscordId}`);
    }

    const guild = this.formatRow(insertedGuilds[0]);

    this.dataLoader.clear(guild.discordId).prime(guild.discordId, guild);

    return guild;
  }

  public async tryGetGuild(opts: { guildDiscordId: Snowflake }) {
    const guild = await this.getGuild({ guildDiscordId: opts.guildDiscordId });

    if (!guild) {
      throw new Error("Server not found");
    }

    return guild;
  }

  public async verifyGuild(opts: { guildDiscordId: Snowflake }) {
    const server = await this.getGuild({
      guildDiscordId: opts.guildDiscordId,
    });

    if (server) {
      return server;
    }

    return await this.createGuild({
      guildDiscordId: opts.guildDiscordId,
    });
  }

  public async modifyGuild(opts: {
    guildDiscordId: Snowflake;
    newPrefix?: string;
    newCasinoChannelId?: Snowflake | null;
    newLanguage?: Language | null;
    modifyCurrencyPointsDisplayName?: string | null;
  }) {
    const updatedGuilds = await this.knex<GuildTableRaw>(Table.GUILDS)
      .where({ discordId: opts.guildDiscordId })
      .update({
        updatedAt: new Date(),
        ...(opts.newPrefix ? { prefix: opts.newPrefix } : {}),
        ...(opts.newCasinoChannelId !== undefined
          ? { casinoChannelId: opts.newCasinoChannelId }
          : {}),
        ...(opts.modifyCurrencyPointsDisplayName !== undefined
          ? { currencyPointsDisplayName: opts.modifyCurrencyPointsDisplayName }
          : {}),

        ...(opts.newLanguage !== undefined
          ? { language: opts.newLanguage }
          : {}),
      })
      .returning("*");

    if (updatedGuilds.length !== 1) {
      this.logger.error(`Could modify create server: ${opts.guildDiscordId}`);
      throw new Error(`Could modify create server: ${opts.guildDiscordId}`);
    }

    const guild = this.formatRow(updatedGuilds[0]);

    this.dataLoader.clear(guild.discordId).prime(guild.discordId, guild);

    return guild;
  }
}
