import { Command } from "discord.js";

export const tokensCommand: Command = {
  name: "Tokens",
  command: "tokens",
  aliases: [],
  syntax: "<query>",
  examples: ["book"],
  isAdmin: false,
  description: "Your tokens currently",

  async execute(message, _, { dataSources, utils }) {
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle(`${user.tokens} tokens`);

    message.channel.send(embed);
  },
};
