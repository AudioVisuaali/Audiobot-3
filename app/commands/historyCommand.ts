import Table from "table-layout";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { CurrencyHistoryTable } from "~/dataSources/CurrencyHistoryDataSource";
import { responseUtils } from "~/utils/responseUtils";
import { tableUtils } from "~/utils/tableUtils";

class HistoryCommand extends AbstractCommand {
  private async getCurrencies() {
    const guildId = this.message.guild.id;
    const authorId = this.message.author.id;

    if (this.args.length === 0) {
      return await this.dataSources.currencyHistoryDS.getCurrencyHistories({
        discordGuildId: guildId,
        discordUserId: authorId,
      });
    }

    if (this.args.length !== 1) {
      return null;
    }

    switch (this.args[0]) {
      case "won":
      case "win":
        return await this.dataSources.currencyHistoryDS.getCurrencyHistories(
          { discordGuildId: guildId, discordUserId: authorId },
          { outcome: "DESC" },
        );

      case "lose":
      case "lost":
      case "defeat":
        return await this.dataSources.currencyHistoryDS.getCurrencyHistories(
          { discordGuildId: guildId, discordUserId: authorId },
          { outcome: "ASC" },
        );
    }

    return null;
  }

  public async execute() {
    const histories = await this.getCurrencies();

    if (histories === null) {
      const embed = responseUtils.invalidParameter({
        discordUser: this.message.author,
      });

      await this.message.channel.send(embed);

      return null;
    }

    if (!histories.length) {
      const embed = responseUtils
        .neutral({ discordUser: this.message.author })
        .setTitle("📄 No data found ¯\\_(ツ)_/¯")
        .setDescription("Start by playing minigames or claiming daily bonuses");

      await this.message.channel.send(embed);

      return null;
    }

    this.createResponseMessage({ histories });
  }

  private async createResponseMessage(params: {
    histories: CurrencyHistoryTable[];
  }) {
    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const displayHistories = await tableUtils.formatHistories({
      guild,
      histories: params.histories,
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
