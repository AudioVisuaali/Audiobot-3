import { Command } from "discord.js";

import { responseUtils } from "~/utils/responseUtils";

export const tokensCommand: Command = {
  name: "Tokens",
  command: "tokens",
  aliases: [],
  syntax: "<query>",
  examples: ["book"],
  isAdmin: false,
  description: "Your tokens currently",

  async execute(message, _, { dataSources }) {
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`${user.tokens} tokens`);

    message.channel.send(embed);
  },
};
