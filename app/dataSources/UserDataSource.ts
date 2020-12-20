import { Snowflake } from "discord.js";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import { Table, UserTableRaw } from "~/database/types";
import { timeUtils } from "~/utils/timeUtils";

export type UserTable = {
  id: number;
  UUID: string;
  discordId: Snowflake;
  guildDiscordId: Snowflake;
  points: number;
  stock: number;
  stockMinCompoundAmount: number;
  xp: number;
  tokens: number;
  dailyRetrieved: DateTime | null;
  createdAt: DateTime;
  updatedAt: DateTime | null;
};

export class UserDataSource extends DataSourceWithContext {
  private formatRow(row: UserTableRaw): UserTable {
    return {
      id: row.id,
      UUID: row.uuid,
      discordId: row.discordId,
      guildDiscordId: row.guildDiscordId,
      points: row.points,
      stock: row.stock,
      stockMinCompoundAmount: row.stockMinCompoundAmount,
      xp: row.xp,
      tokens: row.tokens,
      dailyRetrieved: timeUtils.parseDBTime(row.dailyRetrieved),
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: timeUtils.parseDBTime(row.updatedAt),
    };
  }

  public async getUser(opts: {
    userDiscordId: Snowflake;
    guildDiscordId: Snowflake;
  }) {
    const user = await this.knex<UserTableRaw>(Table.USERS)
      .where({
        discordId: opts.userDiscordId,
        guildDiscordId: opts.guildDiscordId,
      })
      .first();

    return user ? this.formatRow(user) : null;
  }

  public async tryGetUser(opts: { userDiscordId: Snowflake }) {
    const user = await this.knex<UserTableRaw>(Table.USERS)
      .where({ discordId: opts.userDiscordId })
      .first();

    if (!user) {
      throw new Error("User was expected");
    }

    return this.formatRow(user);
  }

  public async updateStockFields() {
    const transaction = await this.knex.transaction();

    await transaction.raw(
      // eslint-disable-next-line quotes
      'UPDATE "users" SET "stock" = stock + FLOOR("stockMinCompoundAmount" * 1 / 100);',
    );

    await transaction.raw(
      // eslint-disable-next-line quotes
      'UPDATE "users" SET "stockMinCompoundAmount" = stock;',
    );

    transaction.commit();
  }

  public async tryModifyCurrency(opts: {
    userDiscordId: Snowflake;
    guildDiscordId: Snowflake;
    modifyPoints?: number;
    modifyStock?: number;
    modifyTokens?: number;
    modifyStockMinCompoundAmount?: number;
    updateDailyClaimed?: boolean;
  }) {
    const user = await this.tryGetUser({ userDiscordId: opts.userDiscordId });

    const updatedUsers = await this.knex<UserTableRaw>(Table.USERS)
      .where({
        discordId: opts.userDiscordId,
        guildDiscordId: opts.guildDiscordId,
      })
      .update({
        updatedAt: new Date(),
        ...(opts.modifyStockMinCompoundAmount
          ? {
              stockMinCompoundAmount:
                user.stockMinCompoundAmount + opts.modifyStockMinCompoundAmount,
            }
          : {}),
        ...(opts.modifyPoints
          ? { points: user.points + opts.modifyPoints }
          : {}),
        ...(opts.modifyStock ? { stock: user.stock + opts.modifyStock } : {}),
        ...(opts.modifyTokens
          ? { tokens: user.tokens + opts.modifyTokens }
          : {}),
        ...(opts.updateDailyClaimed ? { dailyRetrieved: new Date() } : {}),
      })
      .returning("*");

    if (updatedUsers.length !== 1) {
      this.logger.error(`Could not add memes to user: ${opts.userDiscordId}`);
      throw new Error(`Could not add memes to user: ${opts.userDiscordId}`);
    }

    return this.formatRow(updatedUsers[0]);
  }

  public async createUser(opts: {
    userDiscordId: Snowflake;
    guildDiscordId: Snowflake;
  }) {
    const servers = await this.knex<UserTableRaw>(Table.USERS)
      .insert({
        uuid: uuidv4(),
        discordId: opts.userDiscordId,
        guildDiscordId: opts.guildDiscordId,
      })
      .returning("*");

    if (servers.length !== 1) {
      this.logger.error(`Could not add memes to user: ${opts.userDiscordId}`);
      throw new Error(`Could not add memes to user: ${opts.userDiscordId}`);
    }

    return this.formatRow(servers[0]);
  }

  public async verifyUser(opts: {
    userDiscordId: Snowflake;
    guildDiscordId: Snowflake;
  }) {
    const user = await this.getUser({
      userDiscordId: opts.userDiscordId,
      guildDiscordId: opts.guildDiscordId,
    });

    if (user) {
      return user;
    }

    return await this.createUser({
      guildDiscordId: opts.guildDiscordId,
      userDiscordId: opts.userDiscordId,
    });
  }
}
