import { Command } from "discord.js";
import Table from "table-layout";

import { CurrencyHistoryTable } from "~/dataSources/CurrencyHistoryDataSource";
import { DataSources } from "~/dataSources/dataSources";
import { CurrencyHistoryCurrencyType } from "~/database/types";
import { responseUtils } from "~/utils/responseUtils";

const formatPrefix = (number: number) =>
  number < 0 ? number.toString() : `+${number}`;

const formatCurrencyType = (opts: {
  value: number;
  type: CurrencyHistoryCurrencyType;
  usePrefix?: boolean;
}) => {
  const formattedValue = opts.usePrefix ? formatPrefix(opts.value) : opts.value;

  switch (opts.type) {
    case CurrencyHistoryCurrencyType.POINT:
      return `${formattedValue} points`;

    case CurrencyHistoryCurrencyType.TOKEN:
      return `${formattedValue} tokens`;

    default:
      return [opts.value, opts.type].join(" ");
  }
};

const tableHeader = {
  actionType: "TYPE",
  bet: "STAKE",
  outcome: "OUTCOME",
  metadata: "META",
};

const historyRow = (row: CurrencyHistoryTable) => ({
  actionType: row.actionType,
  bet: row.bet
    ? formatCurrencyType({ value: row.bet, type: row.currencyType })
    : "",
  outcome: row.outcome
    ? formatCurrencyType({
        value: row.outcome,
        type: row.currencyType,
        usePrefix: true,
      })
    : "",
  metadata: row.metadata ?? "",
});

const getHistoryData = async (opts: {
  dataSources: DataSources;
  guildId: string;
  authorId: string;
  args: string[];
}) => {
  if (opts.args.length === 0) {
    return await opts.dataSources.currencyHistoryDS.getCurrencyHistories({
      discordGuildId: opts.guildId,
      discordUserId: opts.authorId,
    });
  }

  if (opts.args.length !== 2) {
    return null;
  }

  if (opts.args[0] !== "top") {
    return null;
  }

  switch (opts.args[1]) {
    case "won":
    case "win":
      return await opts.dataSources.currencyHistoryDS.getCurrencyHistories(
        { discordGuildId: opts.guildId, discordUserId: opts.authorId },
        { outcome: "DESC" },
      );

    case "lose":
    case "lost":
    case "defeat":
      return await opts.dataSources.currencyHistoryDS.getCurrencyHistories(
        { discordGuildId: opts.guildId, discordUserId: opts.authorId },
        { outcome: "ASC" },
      );
  }

  return null;
};

export const historyCommand: Command = {
  name: "History",
  command: "history",
  aliases: ["gambling"],
  syntax: "<top> <win | lose>",
  examples: ["", "top win", "top lose"],
  isAdmin: false,
  description: "Get your currency history",

  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const currencyHistories = await getHistoryData({
      dataSources,
      guildId: message.guild.id,
      authorId: message.author.id,
      args,
    });

    if (currencyHistories === null) {
      const embed = responseUtils.invalidParameter({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    if (!currencyHistories.length) {
      const embed = responseUtils
        .neutral({ discordUser: message.author })
        .setTitle("No data found ¯\\_(ツ)_/¯")
        .setDescription("Start by playing minigames or claiming daily bonuses");

      return message.channel.send(embed);
    }

    const displayHistories = [
      tableHeader,
      ...currencyHistories.map(historyRow),
    ];

    const table = new Table(displayHistories);

    const title = `<@${message.author.id}> Your current balance is **${user.points}** points`;

    message.channel.send([title, "```", table.toString(), "```"].join("\n"));
  },
};
