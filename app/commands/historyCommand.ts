import Table from "table-layout";

import { Command } from "~/commands/commands";
import { CurrencyHistoryTable } from "~/dataSources/CurrencyHistoryDataSource";
import { GuildTable } from "~/dataSources/GuildDataSource";
import { DataSources } from "~/dataSources/dataSources";
import { CurrencyHistoryCurrencyType } from "~/database/types";
import { responseUtils } from "~/utils/responseUtils";

const formatCurrencyType = (opts: {
  value: number;
  type: CurrencyHistoryCurrencyType;
  guild: GuildTable;
  usePrefix?: boolean;
}) => {
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
};

const tableHeader = {
  actionType: "TYPE",
  bet: "STAKE",
  outcome: "OUTCOME",
  metadata: "META",
};

const historyRow = (guild: GuildTable) => (row: CurrencyHistoryTable) => ({
  actionType: row.actionType,
  bet: row.bet
    ? formatCurrencyType({ value: row.bet, type: row.currencyType, guild })
    : "",
  outcome: row.outcome
    ? formatCurrencyType({
        value: row.outcome,
        type: row.currencyType,
        guild,
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
  emoji: "📝",
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

    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
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
        .setTitle("📄 No data found ¯\\_(ツ)_/¯")
        .setDescription("Start by playing minigames or claiming daily bonuses");

      return message.channel.send(embed);
    }

    const displayHistories = [
      tableHeader,
      ...currencyHistories.map(historyRow(guild)),
    ];

    const table = new Table(displayHistories);

    const authorQuote = responseUtils.quoteUser({
      user: message.author,
    });

    const currentBalancePoints = responseUtils.formatCurrency({
      guild,
      amount: user.points,
      useBold: true,
    });

    const title = `📝 ${authorQuote} Your current balance is ${currentBalancePoints}`;

    message.channel.send([title, "```", table.toString(), "```"].join("\n"));
  },
};
