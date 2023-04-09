import { Snowflake } from "discord.js";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
  CurrencyHistoryTableRaw,
  Table,
} from "../database/types";
import { timeUtils } from "../utils/timeUtils";

import { DataSourceWithContext } from "./DataSourceWithContext";

export type CurrencyHistoryTable = {
  id: number;
  uuid: string;
  guildId: number;
  userId: number;
  discordGuildId: string;
  discordUserId: string;
  actionType: CurrencyHistoryActionType;
  currencyType: CurrencyHistoryCurrencyType;
  bet: number | null;
  outcome: number | null;
  metadata: string | null;
  hasProfited: boolean;
  createdAt: DateTime;
  updatedAt: DateTime | null;
};

export class CurrencyHistoryDataSource extends DataSourceWithContext {
  private formatRow(row: CurrencyHistoryTableRaw): CurrencyHistoryTable {
    return {
      id: row.id,
      uuid: row.uuid,
      guildId: row.guildId,
      userId: row.userId,
      discordGuildId: row.discordGuildId,
      discordUserId: row.discordUserId,
      actionType: row.actionType,
      currencyType: row.currencyType,
      bet: row.bet,
      outcome: row.outcome,
      metadata: row.metadata,
      hasProfited: row.hasProfited,
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: timeUtils.parseDBTime(row.updatedAt),
    };
  }

  public async getCurrencyHistories(
    opts: {
      discordGuildId: Snowflake;
      discordUserId?: Snowflake;
      actionType?: CurrencyHistoryActionType;
      currencyType?: CurrencyHistoryCurrencyType;
    },
    params?: { outcome: "ASC" | "DESC"; limit?: number },
  ) {
    let instance = this.knex<CurrencyHistoryTableRaw>(Table.CURRENCY_HISTORY);

    if (params?.outcome) {
      instance = instance.orderBy(
        "outcome",
        params.outcome === "ASC" ? "asc" : "desc",
      );
    }

    const currencyHistories = await instance
      .where({
        discordGuildId: opts.discordGuildId,

        ...(opts.discordUserId ? { discordUserId: opts.discordUserId } : {}),
        ...(opts.actionType ? { actionType: opts.actionType } : {}),
        ...(opts.currencyType ? { currencyType: opts.currencyType } : {}),
      })
      .limit(params?.limit ?? 20)
      .orderBy("createdAt", "desc");

    return currencyHistories.map(this.formatRow);
  }

  public async addCurrencyHistory(opts: {
    userId: number;
    guildId: number;
    discordGuildId: Snowflake;
    discordUserId: Snowflake;
    actionType: CurrencyHistoryActionType;
    currencyType: CurrencyHistoryCurrencyType;
    bet: number | null;
    outcome: number | null;
    metadata: string | null;
    hasProfited: boolean;
  }) {
    const currencyHistories = await this.knex<CurrencyHistoryTableRaw>(
      Table.CURRENCY_HISTORY,
    )
      .insert({
        uuid: uuidv4(),
        guildId: opts.guildId,
        userId: opts.userId,
        discordGuildId: opts.discordGuildId,
        discordUserId: opts.discordUserId,
        actionType: opts.actionType,
        currencyType: opts.currencyType,
        bet: opts.bet,
        outcome: opts.outcome,
        metadata: opts.metadata,
        hasProfited: opts.hasProfited,
      })
      .returning("*");

    if (currencyHistories.length !== 1) {
      this.logger.error("Could not create currency history", opts);
      throw new Error("Could not create currency history");
    }

    return this.formatRow(currencyHistories[0]);
  }
}
