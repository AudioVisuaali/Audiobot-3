import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const avatarCommand: Command = {
  name: "Avatar",
  command: "avatar",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Shows requesters avatar",

  async execute(message) {
    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`${message.author.username}'s profile picture`)
      .setImage(
        message.author.avatarURL({ size: 2048 }) ||
          message.author.defaultAvatarURL,
      );

    message.channel.send(embed);
  },
};
