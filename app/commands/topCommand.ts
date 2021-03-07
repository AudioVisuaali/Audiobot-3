import Table from "table-layout";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { tableUtils } from "~/utils/tableUtils";

class TopCommand extends AbstractCommand {
  async execute() {
    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const { type, histories } = await this.getCurrencyHistories();

    const displayHistories = await tableUtils.formatHistories({
      withName: { guildMemberManager: this.message.guild.members },
      includeHeader: true,
      histories,
      guild,
    });

    const table = new Table(displayHistories);

    const title = `📝 Stats for __${this.message.guild.name}__ in order **${type}**`;

    await this.message.channel.send(
      [title, "```", table.toString(), "```"].join("\n"),
    );
  }

  async getCurrencyHistories() {
    const param = this.args.length ? this.args[0] : "win";

    switch (param) {
      case "latest":
      case "newest":
      case "new":
        return {
          type: "newest",
          histories: await this.dataSources.currencyHistoryDS.getCurrencyHistories(
            { discordGuildId: this.message.guild.id },
          ),
        };

      case "won":
      case "wons":
      case "win":
      case "wins":
        return {
          type: "win",
          histories: await this.dataSources.currencyHistoryDS.getCurrencyHistories(
            { discordGuildId: this.message.guild.id },
            { outcome: "DESC" },
          ),
        };

      case "lose":
      case "loses":
      case "lost":
      case "defeat":
      default:
        return {
          type: "lost",
          histories: await this.dataSources.currencyHistoryDS.getCurrencyHistories(
            { discordGuildId: this.message.guild.id },
            { outcome: "ASC" },
          ),
        };
    }
  }
}

export const topCommand: Command = {
  emoji: "📊",
  name: "Top",
  command: "top",
  aliases: [],
  syntax: "<win | lose | latest>",
  examples: ["", "win", "lose", "latest"],
  isAdmin: false,
  description: "Get history of economy on the server",

  getCommand(payload) {
    return new TopCommand(payload);
  },
};
