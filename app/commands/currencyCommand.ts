import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

enum CommandType {
  Reset = "reset",
  Set = "set",
}

class CurrencyCommand extends AbstractCommand {
  private isOwner() {
    return this.message.author.id === this.message.guild.ownerID;
  }

  private isValidActionName() {
    return [CommandType.Reset, CommandType.Set].includes(
      this.args[0] as CommandType,
    );
  }

  private createEmbedTitle() {
    return responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandCurrencyTitle"));
  }

  private async handleCurrencyReset() {
    await this.dataSources.guildDS.modifyGuild({
      guildDiscordId: this.message.guild.id,
      modifyCurrencyPointsDisplayName: null,
    });

    const embed = this.createEmbedTitle().setDescription(
      this.formatMessage("commandCurrencyReset"),
    );

    return await this.message.channel.send(embed);
  }

  private async handleCurrencySet() {
    if (this.args.length !== 2) {
      return false;
    }

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    await this.dataSources.guildDS.modifyGuild({
      guildDiscordId: this.message.guild.id,
      modifyCurrencyPointsDisplayName: this.args[1],
    });

    const embed = this.createEmbedTitle().setDescription(
      this.formatMessage("commandCurrencySetTo", {
        currencyName: guild.currencyPointsDisplayName,
      }),
    );

    return await this.message.channel.send(embed);
  }

  public async execute() {
    if (this.args.length < 1) {
      return;
    }

    if (!this.isOwner()) {
      return;
    }

    if (!this.isValidActionName()) {
      const embed = responseUtils.invalidParameter({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    switch (this.args[0]) {
      case CommandType.Reset:
        return await this.handleCurrencyReset();

      case CommandType.Set:
        return await this.handleCurrencySet();

      default:
    }
  }
}

export const currencyCommand: Command = {
  emoji: "💰",
  name: validateFormatMessageKey("commandCurrencyMetaName"),
  description: validateFormatMessageKey("commandCurrencyMetaDescription"),
  command: "currency",
  aliases: [],
  syntax: "reset | set <currencyName>",
  examples: ["reset", "set memes"],
  isAdmin: true,

  getCommand(payload) {
    return new CurrencyCommand(payload);
  },
};
