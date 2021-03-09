import Table from "table-layout";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
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

type AcceptedCommandTypes =
  | CommandType.Newest
  | CommandType.Win
  | CommandType.Lost;

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

  private getTranslationForCommandType(params: {
    commandType: AcceptedCommandTypes;
  }) {
    switch (params.commandType) {
      case CommandType.Newest:
        return this.formatMessage("commandTopNewest");

      case CommandType.Lost:
        return this.formatMessage("commandTopLost");

      case CommandType.Win:
        return this.formatMessage("commandTopwin");
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
    const title = this.formatMessage("commandTopHead", {
      guildName: this.message.guild.name,
      commandType: this.getTranslationForCommandType({ commandType }),
    });

    await this.message.channel.send(
      this.formatMessage("commandTopBody", {
        title,
        body: table.toString(),
      }),
    );
  }

  async getCurrencyHistories(params: { type: AcceptedCommandTypes }) {
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
  name: validateFormatMessageKey("commandTopMetaName"),
  description: validateFormatMessageKey("commandTopMetaDescription"),
  command: "top",
  aliases: [],
  syntax: "<win | lose | latest>",
  examples: ["", "win", "lose", "latest"],
  isAdmin: false,

  getCommand(payload) {
    return new TopCommand(payload);
  },
};
