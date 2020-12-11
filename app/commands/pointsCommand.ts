import { MessageEmbed, Command } from "discord.js";

export const pointsCommand: Command = {
  name: "Points",
  command: "points",
  aliases: ["memes"],
  description: "Your current financial status",

  async execute(message, _, context) {
    const user = await context.dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle(`${user.points + user.stock} points`)
      .setDescription(
        `You have **${user.points}** points and have invested **${user.stock}** points`,
      )
      .setTimestamp();

    message.channel.send(embed);
  },
};
