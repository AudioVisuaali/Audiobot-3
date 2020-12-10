import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "./DataSourceWithContext";

import { Table, UserTableRaw } from "~/database/types";

export type UserTable = {
  id: number;
  UUID: string;
  discordId: string;
  createdAt: DateTime;
  updatedAt: DateTime | null;
};

export class CommandDataSource extends DataSourceWithContext {
  private formatRow(row: UserTableRaw): UserTable {
    return {
      id: row.id,
      UUID: row.uuid,
      discordId: row.discordId,
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

  public async createUser(opts: { userDiscordId: string }) {
    const server = await this.knex<UserTableRaw>(Table.GUILDS)
      .insert({
        uuid: uuidv4(),
        discordId: opts.userDiscordId,
      })
      .returning("*")
      .first();

    if (!server) {
      this.logger.error(`Could not create server: ${opts.userDiscordId}`);
      throw new Error(`Could not create server: ${opts.userDiscordId}`);
    }

    return this.formatRow(server);
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
}
