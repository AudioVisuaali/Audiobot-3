import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

const PREFIX_MAX_LENGTH = 15;

export const prefixCommand: Command = {
  emoji: "⚛️",
  name: "Prefix",
  command: "prefix",
  aliases: [],
  syntax: "<value>",
  examples: ["#"],
  isAdmin: true,
  description: "Chang the prefix of your server",

  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    if (message.guild.ownerID !== message.author.id) {
      return;
    }

    const { prefix } = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    if (args.length === 0) {
      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setTitle("Prefix")
        .addField("Change your prefix by", `${prefix}prefix <value>`);

      return await message.channel.send(embed);
    }

    const newPrefix = args.join(" ");

    if (newPrefix.length > PREFIX_MAX_LENGTH) {
      const embed = responseUtils
        .negative({ discordUser: message.author })
        .setTitle("Prefix error")
        .setDescription(
          `Maximum length for the prefix is ${PREFIX_MAX_LENGTH} cahracters`,
        )
        .addField("Your prefix is too long", newPrefix);

      return await message.channel.send(embed);
    }

    await dataSources.guildDS.modifyGuild({
      guildDiscordId: message.guild.id,
      newPrefix: newPrefix,
    });

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle("Prefix updated")
      .addField("Your new prefix", newPrefix)
      .addField("Example usage", `${newPrefix}prefix`);

    await message.channel.send(embed);
  },
};
