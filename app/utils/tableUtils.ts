import { responseUtils } from "./responseUtils";

import { CurrencyHistoryTable } from "~/dataSources/CurrencyHistoryDataSource";
import { GuildTable } from "~/dataSources/GuildDataSource";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";

class TableUtils {
  private tableHeader = {
    actionType: "TYPE",
    bet: "STAKE",
    outcome: "OUTCOME",
    metadata: "META",
  };

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

  formatHistories = (opts: {
    guild: GuildTable;
    histories: CurrencyHistoryTable[];
    includeHeader?: boolean;
  }) => {
    const rows = opts.histories.map((history) => ({
      actionType: this.getActionTypeDisplay({ actionType: history.actionType }),
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

    return opts.includeHeader ? [this.tableHeader, ...rows] : rows;
  };
}

export const tableUtils = new TableUtils();
