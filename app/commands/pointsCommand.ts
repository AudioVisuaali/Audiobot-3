import { Command } from "discord.js";

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
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`${user.points + user.stock} points`)
      .setDescription(
        `You have **${user.points}** points and have invested **${user.stock}** points`,
      );

    message.channel.send(embed);
  },
};
