import { GuildMemberManager } from "discord.js";

import { CurrencyHistoryTable } from "../dataSources/CurrencyHistoryDataSource";
import { GuildTable } from "../dataSources/GuildDataSource";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "../database/types";

import { responseUtils } from "./responseUtils";

class TableUtils {
  private tableHeader(opts?: { withName: boolean }) {
    return {
      ...(opts?.withName && { name: "NAME" }),
      actionType: "TYPE",
      bet: "STAKE",
      outcome: "OUTCOME",
      metadata: "META",
    };
  }

  getActionTypeDisplay(opts: { actionType: CurrencyHistoryActionType }) {
    switch (opts.actionType) {
      case CurrencyHistoryActionType.DAILY:
        return "Daily";

      case CurrencyHistoryActionType.FISHING:
        return "Fishing";

      case CurrencyHistoryActionType.FISHING_BAIT:
        return "Fishing bait";

      case CurrencyHistoryActionType.ROULETTE:
        return "Roulette";

      case CurrencyHistoryActionType.SLOTS:
        return "Slots";

      case CurrencyHistoryActionType.TRANSFER:
        return "Transfer";

      case CurrencyHistoryActionType.OWNER_MODIFY:
        return "Server owner";

      default:
        return opts.actionType;
    }
  }

  formatCurrencyType(opts: {
    value: number;
    type: CurrencyHistoryCurrencyType;
    guild: GuildTable;
    usePrefix?: boolean;
  }) {
    switch (opts.type) {
      case CurrencyHistoryCurrencyType.POINT:
        return responseUtils.formatCurrency({
          guild: opts.guild,
          positivePrefix: opts.usePrefix,
          amount: opts.value,
        });

      case CurrencyHistoryCurrencyType.TOKEN:
        return responseUtils.formatTokens({
          positivePrefix: opts.usePrefix,
          amount: opts.value,
        });

      default:
        return [opts.value, opts.type].join(" ");
    }
  }

  async getUser(opts: {
    guildMemberManager: GuildMemberManager;
    discordMemberId: string;
  }) {
    const member = opts.guildMemberManager.cache.get(opts.discordMemberId);

    if (member) {
      return member;
    }

    return await opts.guildMemberManager.fetch(opts.discordMemberId);
  }

  async getUserUsername(opts: {
    guildMemberManager: GuildMemberManager;
    discordUserId: string;
  }) {
    const user = await this.getUser({
      guildMemberManager: opts.guildMemberManager,
      discordMemberId: opts.discordUserId,
    });

    if (!user) {
      return "???";
    }

    return user.user.username;
  }

  formatHistories = async (opts: {
    guild: GuildTable;
    histories: CurrencyHistoryTable[];
    includeHeader?: boolean;
    withName?: {
      guildMemberManager: GuildMemberManager;
    };
  }) => {
    const rows = opts.histories.map(async (history) => ({
      ...(opts.withName && {
        name: await this.getUserUsername({
          guildMemberManager: opts.withName.guildMemberManager,
          discordUserId: history.discordUserId,
        }),
      }),
      actionType: this.getActionTypeDisplay({
        actionType: history.actionType,
      }),
      bet: history.bet
        ? this.formatCurrencyType({
            value: history.bet,
            type: history.currencyType,
            guild: opts.guild,
          })
        : "",
      outcome: history.outcome
        ? this.formatCurrencyType({
            value: history.outcome,
            type: history.currencyType,
            guild: opts.guild,
            usePrefix: true,
          })
        : "",
      metadata: history.metadata ?? "",
    }));

    const resolvedRows = await Promise.all(rows);

    return opts.includeHeader
      ? [this.tableHeader({ withName: !!opts.withName }), ...resolvedRows]
      : resolvedRows;
  };
}

export const tableUtils = new TableUtils();
