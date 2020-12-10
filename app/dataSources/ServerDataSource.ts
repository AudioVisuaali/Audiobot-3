import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "./DataSourceWithContext";

import { Table, ServerTableRaw } from "~/database/types";

export type ServerTable = {
  id: number;
  uuid: string;
  discordId: string;
  prefix: string;
  createdAt: DateTime;
  updatedAt: DateTime | null;
};

export class ServerDataSource extends DataSourceWithContext {
  private formatRow(row: ServerTableRaw): ServerTable {
    return {
      id: row.id,
      uuid: row.uuid,
      discordId: row.discordId,
      prefix: row.prefix,
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
    };
  }

  public async getServer(opts: { serverDiscordId: string }) {
    const server = await this.knex<ServerTableRaw>(Table.GUILDS)
      .where({ discordId: opts.serverDiscordId })
      .first();

    return server ? this.formatRow(server) : null;
  }

  public async createServer(opts: { serverDiscordId: string }) {
    const insertedServers = await this.knex<ServerTableRaw>(Table.GUILDS)
      .insert({
        uuid: uuidv4(),
        discordId: opts.serverDiscordId,
        prefix: this.config.discordCommandPrefixDefault,
      })
      .returning("*");

    if (insertedServers.length !== 1) {
      this.logger.error(`Could not create server: ${opts.serverDiscordId}`);
      throw new Error(`Could not create server: ${opts.serverDiscordId}`);
    }

    const [server] = insertedServers;

    return this.formatRow(server);
  }

  public async verifyServer(opts: { serverDiscordId: string }) {
    const user = await this.getServer({
      serverDiscordId: opts.serverDiscordId,
    });

    if (user) {
      return user;
    }

    return await this.createServer({
      serverDiscordId: opts.serverDiscordId,
    });
  }
}
