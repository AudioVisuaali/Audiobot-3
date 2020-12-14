import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const pointsCommand: Command = {
  name: "Points",
  command: "points",
  aliases: ["memes"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Your current financial status",

  async execute(message, _, { dataSources }) {
    if (!message.guild) {
      return;
    }

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild?.id,
    });

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
      .positive({ discordUser: message.author })
      .setTitle(totalPoints)
      .setDescription(
        `You have ${userPoints} and have invested ${userStockPoints}`,
      );

    message.channel.send(embed);
  },
};
