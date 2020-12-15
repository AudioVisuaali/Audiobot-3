import Table from "table-layout";

import { Command } from "~/commands/commands";
import { DataSources } from "~/dataSources/dataSources";
import { responseUtils } from "~/utils/responseUtils";
import { tableUtils } from "~/utils/tableUtils";

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

  if (opts.args.length !== 1) {
    return null;
  }

  switch (opts.args[0]) {
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
  syntax: "<win | lose>",
  examples: ["", "win", "lose"],
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

    const displayHistories = tableUtils.formatHistories({
      guild,
      histories: currencyHistories,
      includeHeader: true,
    });

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
