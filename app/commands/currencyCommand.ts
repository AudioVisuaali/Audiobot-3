import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const currencyCommand: Command = {
  name: "Currency",
  command: "currency",
  aliases: [],
  syntax: "reset | set <currencyName>",
  examples: ["reset", "set memes"],
  isAdmin: true,
  description: "Change display name on currency",

  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    if (args.length < 1) {
      return;
    }

    const isOwner = message.author.id === message.guild.ownerID;

    if (!isOwner) {
      return;
    }

    if (!["reset", "set"].includes(args[0])) {
      const embed = responseUtils.invalidParameter({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    switch (args[0]) {
      // eslint-disable-next-line switch-case/newline-between-switch-case
      case "reset":
        await dataSources.guildDS.modifyGuild({
          guildDiscordId: message.guild.id,
          modifyCurrencyPointsDisplayName: null,
        });
        break;

      // eslint-disable-next-line switch-case/no-case-curly
      case "set": {
        if (args.length !== 2) {
          return;
        }

        await dataSources.guildDS.modifyGuild({
          guildDiscordId: message.guild.id,
          modifyCurrencyPointsDisplayName: args[1],
        });
        break;
      }
    }

    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    const description =
      args[0] === "reset"
        ? "You have reset currency name to **points**"
        : `You have set the currency name to **${guild.currencyPointsDisplayName}**`;

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle("You have updated currency name")
      .setDescription(description);

    return message.channel.send(embed);
  },
};
