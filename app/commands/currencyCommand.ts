import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class CurrencyCommand extends AbstractCommand {
  private isOwner() {
    return this.message.author.id === this.message.guild.ownerID;
  }

  private isValidActionName() {
    return ["reset", "set"].includes(this.args[0]);
  }

  private createEmbedTitle() {
    return responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle("💲 You have updated currency name");
  }

  private async handleCurrencyReset() {
    await this.dataSources.guildDS.modifyGuild({
      guildDiscordId: this.message.guild.id,
      modifyCurrencyPointsDisplayName: null,
    });

    const embed = this.createEmbedTitle().setDescription(
      "You have reset currency name to **points**",
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
      `You have set the currency name to **${guild.currencyPointsDisplayName}**`,
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
      case "reset":
        return await this.handleCurrencyReset();

      case "set":
        return await this.handleCurrencySet();
    }
  }
}

export const currencyCommand: Command = {
  emoji: "💰",
  name: "Currency",
  command: "currency",
  aliases: [],
  syntax: "reset | set <currencyName>",
  examples: ["reset", "set memes"],
  isAdmin: true,
  description: "Change display name on currency",

  getCommand(payload) {
    return new CurrencyCommand(payload);
  },
};
