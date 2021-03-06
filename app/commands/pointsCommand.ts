import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class PointsCommand extends AbstractCommand {
  private async getUserAndGuild() {
    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild?.id,
    });

    return { user, guild };
  }

  public async execute() {
    const { user, guild } = await this.getUserAndGuild();

    const totalPoints = responseUtils.formatCurrency({
      guild,
      amount: user.points + user.stock,
    });

    const userPoints = responseUtils.formatCurrency({
      guild,
      amount: user.points,
      useBold: true,
    });

    const userStockPoints = responseUtils.formatCurrency({
      guild,
      amount: user.stock,
      useBold: true,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(totalPoints)
      .setDescription(
        this.formatMessage("commandPointsDescription", {
          userPoints,
          investedPoints: userStockPoints,
        }),
      );

    await this.message.channel.send(embed);
  }
}

export const pointsCommand: Command = {
  emoji: "💸",
  name: validateFormatMessageKey("commandPointsMetaName"),
  description: validateFormatMessageKey("commandPointsMetaDescrition"),
  command: "points",
  aliases: ["memes"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new PointsCommand(payload);
  },
};
