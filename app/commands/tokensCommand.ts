import { MessageEmbed, Command } from "discord.js";

export const tokensCommand: Command = {
  name: "Tokens",
  command: "tokens",
  aliases: [],
  description: "Your tokens currently",

  async execute(message, _, context) {
    const user = await context.dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle(`${user.tokens} tokens`)
      .setTimestamp();

    message.channel.send(embed);
  },
};
