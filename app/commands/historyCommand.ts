import Table from "table-layout";

import { AbstractCommand } from "~/commands/AbstractCommand";
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

class HistoryCommand extends AbstractCommand {
  async execute() {
    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const currencyHistories = await getHistoryData({
      dataSources: this.dataSources,
      guildId: this.message.guild.id,
      authorId: this.message.author.id,
      args: this.args,
    });

    if (currencyHistories === null) {
      const embed = responseUtils.invalidParameter({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    if (!currencyHistories.length) {
      const embed = responseUtils
        .neutral({ discordUser: this.message.author })
        .setTitle("📄 No data found ¯\\_(ツ)_/¯")
        .setDescription("Start by playing minigames or claiming daily bonuses");

      return await this.message.channel.send(embed);
    }

    const displayHistories = await tableUtils.formatHistories({
      guild,
      histories: currencyHistories,
      includeHeader: true,
    });

    const table = new Table(displayHistories);

    const authorQuote = responseUtils.quoteUser({
      user: this.message.author,
    });

    const currentBalancePoints = responseUtils.formatCurrency({
      guild,
      amount: user.points,
      useBold: true,
    });

    const title = `📝 ${authorQuote} Your current balance is ${currentBalancePoints}`;

    await this.message.channel.send(
      [title, "```", table.toString(), "```"].join("\n"),
    );
  }
}

export const historyCommand: Command = {
  emoji: "📝",
  name: "History",
  command: "history",
  aliases: ["gambling"],
  syntax: "<win | lose>",
  examples: ["", "win", "lose"],
  isAdmin: false,
  description: "Get your currency history",

  getCommand(payload) {
    return new HistoryCommand(payload);
  },
};
