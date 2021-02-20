import {
  Command,
  sortedModules,
  commands as allCommands,
} from "~/commands/commands";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

const COMMAND_AMOUNT_PER_PAGE = 12;

const getPageOrName = (args: string[]) => {
  if (!args.length) {
    return { pageIndex: 1, name: null };
  }

  const [arg] = args;

  const parsed = mathUtils.parseStringToNumber(arg);
  const isNumber = parsed !== null;

  return {
    pageIndex: isNumber ? parsed : null,
    name: isNumber ? null : arg,
  };
};

export const helpCommand: Command = {
  emoji: "📖",
  name: "Help",
  command: "help",
  aliases: ["heelp", "commands"],
  syntax: "<command?>",
  examples: ["", "help"],
  isAdmin: false,
  description: "Help menu",

  // eslint-disable-next-line max-statements
  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    const isOwner = message.guild.ownerID === message.author.id;

    const { prefix } = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    const { pageIndex: pageIndexCode, name } = getPageOrName(args);

    if (name) {
      const command = allCommands.find(
        (command) =>
          command.command === name ||
          command.aliases.find((alias) => alias === name),
      );

      if (!command) {
        const embed = responseUtils
          .negative({ discordUser: message.author })
          .setTitle(`📖 Help => ${name}`)
          .setDescription(`Could not find module: ${args[0]}`);

        return await message.channel.send(embed);
      }

      const examples = command.examples.length
        ? command.examples
            .map((example) => `${prefix}${command.command} ${example}`)
            .join("\n")
        : `${prefix}${command.command}`;

      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setTitle(`📖 Help => ${command.name}`)
        .setDescription(command.description)
        .addField("Syntax", `${prefix}${command.command} ${command.syntax}`)
        .addField("Examples", examples);

      if (command.aliases.length) {
        embed.addField("Aliases", command.aliases.join("\n"));
      }

      await message.channel.send(embed);
    }

    if (pageIndexCode !== null) {
      const pageIndex = pageIndexCode;
      const { commands, adminCommands } = sortedModules;

      const combinesCommands = isOwner
        ? [...commands, ...adminCommands]
        : commands;

      const lastPageIndex = Math.ceil(
        combinesCommands.length / COMMAND_AMOUNT_PER_PAGE,
      );

      const isPrevPage = pageIndex > 1;
      const isNextPage = pageIndex < lastPageIndex;

      if (pageIndex < 1 || pageIndex > lastPageIndex) {
        const embed = responseUtils
          .invalidParameter({ discordUser: message.author })
          .setDescription("Invalid page index");

        return await message.channel.send(embed);
      }

      const startIndex = (pageIndex - 1) * COMMAND_AMOUNT_PER_PAGE;
      const menuCommands = combinesCommands
        .slice(startIndex)
        .slice(0, COMMAND_AMOUNT_PER_PAGE);

      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setTitle(`📖 Help > Page ${pageIndex}`)
        .setDescription(
          `You can get more info by doing ${prefix}help <command>`,
        );

      if (isPrevPage) {
        embed.addField(
          "Previous page",
          `⏪ ${prefix}help ${pageIndex - 1}`,
          false,
        );
      }

      embed.addFields(
        menuCommands.map((command) => ({
          name: command.isAdmin
            ? `${command.emoji} ADMIN: ${command.name}`
            : `${command.emoji} ${command.name}`,
          value: `${prefix}help ${command.command}`,
          inline: true,
        })),
      );

      if (isNextPage) {
        embed.addField("Next page", `⏩ ${prefix}help ${pageIndex + 1}`, false);
      }

      return await message.channel.send(embed);
    }
  },
};
