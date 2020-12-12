import { Command } from "discord.js";

const PREFIX_MAX_LENGTH = 15;

export const prefixCommand: Command = {
  name: "Prefix",
  command: "prefix",
  aliases: [],
  syntax: "<value>",
  examples: ["#"],
  isAdmin: true,
  description: "Chang the prefix of your server",

  async execute(message, args, { dataSources, dataLoaders, utils }) {
    if (!message.guild) {
      return;
    }

    if (message.guild.ownerID !== message.author.id) {
      return;
    }

    const prefix = await dataLoaders.prefixDL.load(message.guild.id);

    if (args.length === 0) {
      const embed = utils.response
        .positive({ discordUser: message.author })
        .setTitle("Prefix")
        .addField("Change your prefix by", `${prefix}prefix <value>`);

      return message.channel.send(embed);
    }

    const newPrefix = args.join(" ");

    if (newPrefix.length > PREFIX_MAX_LENGTH) {
      const embed = utils.response
        .negative({ discordUser: message.author })
        .setTitle("Prefix error")
        .setDescription(
          `Maximum length for the prefix is ${PREFIX_MAX_LENGTH} cahracters`,
        )
        .addField("Your prefix is too long", newPrefix);

      return message.channel.send(embed);
    }

    const guild = await dataSources.guildDS.modifyGuildPrefix({
      guildDiscordId: message.guild.id,
      prefix: newPrefix,
    });

    dataLoaders.prefixDL
      .clear(guild.discordId)
      .prime(guild.discordId, guild.prefix);

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle("Prefix updated")
      .addField("Your new prefix", newPrefix)
      .addField("Example usage", `${newPrefix}prefix`);

    message.channel.send(embed);
  },
};