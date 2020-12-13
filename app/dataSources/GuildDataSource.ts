import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "./DataSourceWithContext";

import { Table, GuildTableRaw } from "~/database/types";
import { timeUtils } from "~/utils/timeUtils";

export type GuildTable = {
  id: number;
  uuid: string;
  discordId: string;
  prefix: string;
  createdAt: DateTime;
  updatedAt: DateTime | null;
};

export class GuildDataSource extends DataSourceWithContext {
  private formatRow(row: GuildTableRaw): GuildTable {
    return {
      id: row.id,
      uuid: row.uuid,
      discordId: row.discordId,
      prefix: row.prefix,
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: timeUtils.parseDBTime(row.updatedAt),
    };
  }

  public async getGuild(opts: { guildDiscordId: string }) {
    const guild = await this.knex<GuildTableRaw>(Table.GUILDS)
      .where({ discordId: opts.guildDiscordId })
      .first();

    return guild ? this.formatRow(guild) : null;
  }

  public async createGuild(opts: { guildDiscordId: string }) {
    const insertedGuilds = await this.knex<GuildTableRaw>(Table.GUILDS)
      .insert({
        uuid: uuidv4(),
        discordId: opts.guildDiscordId,
        prefix: this.config.discordCommandPrefixDefault,
      })
      .returning("*");

    if (insertedGuilds.length !== 1) {
      this.logger.error(`Could not create server: ${opts.guildDiscordId}`);
      throw new Error(`Could not create server: ${opts.guildDiscordId}`);
    }

    const [guild] = insertedGuilds;

    return this.formatRow(guild);
  }

  public async tryGetGuild(opts: { guildDiscordId: string }) {
    const guild = await this.knex<GuildTableRaw>(Table.GUILDS)
      .where({ discordId: opts.guildDiscordId })
      .first();

    if (!guild) {
      throw new Error("Server not found");
    }

    return this.formatRow(guild);
  }

  public async verifyGuild(opts: { guildDiscordId: string }) {
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

  public async modifyGuildPrefix(opts: {
    guildDiscordId: string;
    prefix: string;
  }) {
    const updatedGuilds = await this.knex<GuildTableRaw>(Table.GUILDS)
      .where({ discordId: opts.guildDiscordId })
      .update({ prefix: opts.prefix, updatedAt: new Date() })
      .returning("*");

    if (updatedGuilds.length !== 1) {
      this.logger.error(`Could modify create server: ${opts.guildDiscordId}`);
      throw new Error(`Could modify create server: ${opts.guildDiscordId}`);
    }

    const [guild] = updatedGuilds;

    return this.formatRow(guild);
  }
}
