import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class CurrencyCommand extends AbstractCommand {
  isOwner() {
    return this.message.author.id === this.message.guild.ownerID;
  }

  async execute() {
    if (this.args.length < 1) {
      return;
    }

    if (!this.isOwner()) {
      return;
    }

    if (!["reset", "set"].includes(this.args[0])) {
      const embed = responseUtils.invalidParameter({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    switch (this.args[0]) {
      // eslint-disable-next-line switch-case/newline-between-switch-case
      case "reset":
        await this.dataSources.guildDS.modifyGuild({
          guildDiscordId: this.message.guild.id,
          modifyCurrencyPointsDisplayName: null,
        });
        break;

      // eslint-disable-next-line switch-case/no-case-curly
      case "set": {
        if (this.args.length !== 2) {
          return;
        }

        await this.dataSources.guildDS.modifyGuild({
          guildDiscordId: this.message.guild.id,
          modifyCurrencyPointsDisplayName: this.args[1],
        });
        break;
      }
    }

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const description =
      this.args[0] === "reset"
        ? "You have reset currency name to **points**"
        : `You have set the currency name to **${guild.currencyPointsDisplayName}**`;

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle("💲 You have updated currency name")
      .setDescription(description);

    return await this.message.channel.send(embed);
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
