import { Command } from "discord.js";

import { responseUtils } from "~/utils/responseUtils";

export const serverCommand: Command = {
  name: "Server Info",
  command: "serverinfo",
  aliases: ["server"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get information about the server",

  async execute(message) {
    if (!message.guild) {
      return;
    }

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setAuthor(message.guild.name, message.guild.iconURL() ?? undefined)
      .addField("Verification Level", message.guild.verificationLevel, true)
      .addField("Region", message.guild.region, true)
      .addField("Users", message.guild.memberCount, true)
      // .addField("Channels -> categories,text,voice")
      .addField("Large server", message.guild.large, true)
      // .addField("Emojis", message.guild.emojis, true) // Count
      .addField("Owner", message.guild.owner?.displayName, true)
      .addField("Created at", message.guild.createdAt, true);
    // .addField("Roles", message.guild.roles, true);

    const serverUrl = message.guild.iconURL();
    if (serverUrl) {
      embed.setThumbnail(serverUrl);
    }

    message.channel.send(embed);
  },
};
