import { Command } from "~/commands/commands";
import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";

export const casinoCommand: Command = {
  emoji: "🎰",
  name: "Casino",
  command: "casino",
  aliases: [],
  syntax: "delete | current | <set> <#channel>",
  examples: [],
  isAdmin: true,
  description: "Admin tool for settings casino",

  // eslint-disable-next-line max-statements
  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    if (message.author.id !== message.guild.ownerID) {
      const embed = responseUtils.invalidPermissions({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    if (args.length < 1) {
      return;
    }

    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    switch (args[0]) {
      // eslint-disable-next-line switch-case/no-case-curly
      case "delete": {
        await dataSources.guildDS.modifyGuild({
          guildDiscordId: message.guild.id,
          newCasinoChannelId: null,
        });

        const embed = responseUtils
          .positive({ discordUser: message.author })
          .setTitle("Admin / Casino")
          .setDescription("Casino room has ben succesfully removed");

        return message.channel.send(embed);
      }

      // eslint-disable-next-line switch-case/no-case-curly
      case "current": {
        const embed = responseUtils
          .positive({ discordUser: message.author })
          .setTitle("Admin / Casino")
          .addField(
            "Current casino channel",
            guild.casinoChannelId ? `<#${guild.casinoChannelId}>` : "_None_",
          );

        return message.channel.send(embed);
      }

      // eslint-disable-next-line switch-case/no-case-curly
      case "set": {
        if (args.length !== 2) {
          const embed = responseUtils.invalidParameter({
            discordUser: message.author,
          });

          return message.channel.send(embed);
        }

        const channelMention = inputUtils.getChannelMention({
          message,
          mentionInString: args[1],
        });

        if (!channelMention) {
          const embed = responseUtils.invalidReferenceChannel({
            discordUser: message.author,
          });

          return message.channel.send(embed);
        }

        if (channelMention.guild.id !== message.guild.id) {
          const embed = responseUtils.invalidReferenceChannel({
            discordUser: message.author,
          });

          return message.channel.send(embed);
        }

        const modifiedGuild = await dataSources.guildDS.modifyGuild({
          guildDiscordId: message.guild.id,
          newCasinoChannelId: channelMention.id,
        });

        const embed = responseUtils
          .positive({ discordUser: message.author })
          .setTitle("Admin / Casino")
          .setDescription("Casino channel updated for server")
          .addField(
            "Current casino channel",
            modifiedGuild.casinoChannelId
              ? `<#${modifiedGuild.casinoChannelId}>`
              : modifiedGuild.casinoChannelId,
          );

        return message.channel.send(embed);
      }
    }
  },
};
