import { Snowflake } from "discord.js";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import { Table, BotInfoTableRaw } from "~/database/types";
import { timeUtils } from "~/utils/timeUtils";

export type BotInfoTable = {
  id: number;
  uuid: string;
  discordBotId: Snowflake;
  restarts: number;
  createdAt: DateTime;
  updatedAt: DateTime | null;
};
export class BotInfoDataSource extends DataSourceWithContext {
  private formatRow(row: BotInfoTableRaw): BotInfoTable {
    return {
      id: row.id,
      uuid: row.uuid,
      discordBotId: row.discordBotId,
      restarts: row.restarts,
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: timeUtils.parseDBTime(row.updatedAt),
    };
  }

  async testConnection() {
    await this.knex.raw("SELECT 1 + 1 as result;");
  }

  public async modifyBotInfo(opts: {
    discordBotId: Snowflake;
    modifyRestarts?: number;
    updateDailyClaimed?: boolean;
  }) {
    const botInfo = await this.tryGetBotInfo({
      discordBotId: opts.discordBotId,
    });

    const botInfos = await this.knex<BotInfoTableRaw>(Table.BOT_INFO)
      .where({ discordBotId: opts.discordBotId })
      .update({
        updatedAt: new Date(),
        ...(opts.modifyRestarts
          ? { restarts: botInfo.restarts + opts.modifyRestarts }
          : {}),
      })
      .returning("*");

    if (botInfos.length !== 1) {
      this.logger.error("Could modify bot info", opts);
      throw new Error("Could modify bot info");
    }

    return this.formatRow(botInfos[0]);
  }

  public async getBotInfo(opts: { discordBotId: Snowflake }) {
    const botInfo = await this.knex<BotInfoTableRaw>(Table.BOT_INFO)
      .where({ discordBotId: opts.discordBotId })
      .first();

    return botInfo ? this.formatRow(botInfo) : null;
  }

  public async tryGetBotInfo(opts: { discordBotId: Snowflake }) {
    const botInfo = await this.getBotInfo({ discordBotId: opts.discordBotId });

    if (!botInfo) {
      this.logger.error("Could not get bot info", opts);
      throw new Error("Could not get bot info");
    }

    return botInfo;
  }

  public async verifyBotInfo(opts: { discordBotId: Snowflake }) {
    const botInfo = await this.getBotInfo({ discordBotId: opts.discordBotId });

    if (botInfo) {
      return botInfo;
    }

    return await this.createBotInfo({ discordBotId: opts.discordBotId });
  }

  public async createBotInfo(opts: { discordBotId: Snowflake }) {
    const botInfo = await this.knex<BotInfoTableRaw>(Table.BOT_INFO)
      .insert({ uuid: uuidv4(), discordBotId: opts.discordBotId })
      .returning("*");

    if (botInfo.length !== 1) {
      this.logger.error("Could not create bot info", opts);
      throw new Error("Could not create bot info");
    }

    return this.formatRow(botInfo[0]);
  }
}
