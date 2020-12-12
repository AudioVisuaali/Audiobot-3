import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "./DataSourceWithContext";

import { Table, UserTableRaw } from "~/database/types";
import { mathUtils } from "~/utils/mathUtil";

export type UserTable = {
  id: number;
  UUID: string;
  discordId: string;
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
      points: row.points,
      stock: row.stock,
      stockMinCompoundAmount: row.stockMinCompoundAmount,
      xp: row.xp,
      tokens: row.tokens,
      dailyRetrieved: row.dailyRetrieved
        ? DateTime.fromJSDate(row.dailyRetrieved)
        : null,
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
    };
  }

  public async getUser(opts: { userDiscordId: string }) {
    const user = await this.knex<UserTableRaw>(Table.USERS)
      .where({ discordId: opts.userDiscordId })
      .first();

    return user ? this.formatRow(user) : null;
  }

  public async tryGetUser(opts: { userDiscordId: string }) {
    const user = await this.knex<UserTableRaw>(Table.USERS)
      .where({ discordId: opts.userDiscordId })
      .first();

    if (!user) {
      throw new Error("User was expected");
    }

    return this.formatRow(user);
  }

  public async tryModifyMemes(opts: {
    userDiscordId: string;
    modifyMemeCount: number;
    updateDailyClaimed?: boolean;
  }) {
    const user = await this.tryGetUser({ userDiscordId: opts.userDiscordId });

    const updatedUsers = await this.knex<UserTableRaw>(Table.USERS)
      .where({ discordId: opts.userDiscordId })
      .update({
        points: user.points + opts.modifyMemeCount,
        updatedAt: new Date(),
        ...(opts.updateDailyClaimed ? { dailyRetrieved: new Date() } : {}),
      })
      .returning("*");

    if (updatedUsers.length !== 1) {
      this.logger.error(`Could not add memes to user: ${opts.userDiscordId}`);
      throw new Error(`Could not add memes to user: ${opts.userDiscordId}`);
    }

    return this.formatRow(updatedUsers[0]);
  }

  public async createUser(opts: { userDiscordId: string }) {
    const servers = await this.knex<UserTableRaw>(Table.USERS)
      .insert({
        uuid: uuidv4(),
        discordId: opts.userDiscordId,
      })
      .returning("*");

    if (servers.length !== 1) {
      this.logger.error(`Could not add memes to user: ${opts.userDiscordId}`);
      throw new Error(`Could not add memes to user: ${opts.userDiscordId}`);
    }

    return this.formatRow(servers[0]);
  }

  public async verifyUser(opts: { userDiscordId: string }) {
    const user = await this.getUser({ userDiscordId: opts.userDiscordId });

    if (user) {
      return user;
    }

    return await this.createUser({
      userDiscordId: opts.userDiscordId,
    });
  }

  public async getAmountFromUserInput(opts: {
    input: string;
    user: UserTable;
  }) {
    switch (opts.input) {
      case "all":
        return opts.user.points;

      case "half":
        return Math.floor(opts.user.points / 2);

      case "third":
        return Math.floor(opts.user.points / 3);
    }

    // 80% 56%
    if (opts.input.endsWith("%")) {
      const percent = parseFloat(opts.input);

      if (isNaN(percent) || percent < 0 || percent > 100) {
        return null;
      }

      return Math.floor(opts.user.points * (percent / 100));
    }

    return mathUtils.parseStringToNumber(opts.input);
  }
}
