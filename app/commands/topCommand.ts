import Table from "table-layout";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { tableUtils } from "~/utils/tableUtils";

enum CommandType {
  Latest = "latest",
  Newest = "newest",
  New = "new",

  Won = "won",
  Wons = "wons",
  Win = "win",
  Wins = "wins",

  Lose = "lose",
  Loses = "loses",
  Lost = "lost",
  Defeat = "defeat",
}

class TopCommand extends AbstractCommand {
  private getCommandType() {
    const param = this.args.length ? this.args[0] : "win";

    switch (param) {
      case CommandType.Latest:
      case CommandType.Newest:
      case CommandType.New:
        return CommandType.Newest;

      case CommandType.Lose:
      case CommandType.Loses:
      case CommandType.Lost:
      case CommandType.Defeat:
        return CommandType.Lost;

      case CommandType.Won:
      case CommandType.Wons:
      case CommandType.Win:
      case CommandType.Wins:
      default:
        return CommandType.Win;
    }
  }

  public async execute() {
    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const commandType = this.getCommandType();

    const histories = await this.getCurrencyHistories({ type: commandType });

    const displayHistories = await tableUtils.formatHistories({
      withName: { guildMemberManager: this.message.guild.members },
      includeHeader: true,
      histories,
      guild,
    });

    const table = new Table(displayHistories);
    const title = `📝 Stats for __${this.message.guild.name}__ in order **${commandType}**`;

    await this.message.channel.send(
      [title, "```", table.toString(), "```"].join("\n"),
    );
  }

  async getCurrencyHistories(params: {
    type: CommandType.Newest | CommandType.Win | CommandType.Lost;
  }) {
    switch (params.type) {
      case CommandType.Newest:
        return await this.dataSources.currencyHistoryDS.getCurrencyHistories({
          discordGuildId: this.message.guild.id,
        });

      case CommandType.Win:
        return await this.dataSources.currencyHistoryDS.getCurrencyHistories(
          { discordGuildId: this.message.guild.id },
          { outcome: "DESC" },
        );

      case CommandType.Lost:
        return await this.dataSources.currencyHistoryDS.getCurrencyHistories(
          { discordGuildId: this.message.guild.id },
          { outcome: "ASC" },
        );
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
