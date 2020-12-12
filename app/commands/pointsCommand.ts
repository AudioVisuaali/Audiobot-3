import { Command } from "discord.js";

export const pointsCommand: Command = {
  name: "Points",
  command: "points",
  aliases: ["memes"],
  description: "Your current financial status",

  async execute(message, _, { dataSources, utils }) {
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle(`${user.points + user.stock} points`)
      .setDescription(
        `You have **${user.points}** points and have invested **${user.stock}** points`,
      );

    message.channel.send(embed);
  },
};
