import { AbstractCommand } from "~/commands/AbstractCommand";
import {
  Command,
  sortedModules,
  commands as allCommands,
} from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
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

class HelpCommand extends AbstractCommand {
  private async handleCommandResponse(params: {
    commandName: string;
    prefix: string;
  }) {
    const command = allCommands.find(
      (command) =>
        command.command === params.commandName ||
        command.aliases.find((alias) => alias === params.commandName),
    );

    if (!command) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle(
          this.formatMessage("commandHelpTitleCommand", {
            commandName: params.commandName,
          }),
        )
        .setDescription(
          this.formatMessage("commandHelpCoudNotFindModule", {
            moduleName: this.args[0],
          }),
        );

      return await this.message.channel.send(embed);
    }

    const examples = command.examples.length
      ? command.examples
          .map((example) => `${params.prefix}${command.command} ${example}`)
          .join("\n")
      : `${params.prefix}${command.command}`;

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`📖 Help => ${this.formatMessage(command.name)}`)
      .setDescription(this.formatMessage(command.description))
      .addField(
        this.formatMessage("commandHelpSyntax"),
        `${params.prefix}${command.command} ${command.syntax}`,
      )
      .addField(this.formatMessage("commandHelpExamples"), examples);

    if (command.aliases.length) {
      embed.addField(
        this.formatMessage("commandHelpAliases"),
        command.aliases.join("\n"),
      );
    }

    await this.message.channel.send(embed);
  }

  private isServerOwner() {
    return this.message.guild.ownerID === this.message.author.id;
  }

  public async execute() {
    const { pageIndex: pageIndexCode, name } = getPageOrName(this.args);

    const { prefix } = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    if (name) {
      return this.handleCommandResponse({ commandName: name, prefix });
    }

    if (pageIndexCode !== null) {
      const pageIndex = pageIndexCode;
      const { commands, adminCommands } = sortedModules;

      const combinesCommands = this.isServerOwner()
        ? [...commands, ...adminCommands]
        : commands;

      const lastPageIndex = Math.ceil(
        combinesCommands.length / COMMAND_AMOUNT_PER_PAGE,
      );

      const isPrevPage = pageIndex > 1;
      const isNextPage = pageIndex < lastPageIndex;

      if (pageIndex < 1 || pageIndex > lastPageIndex) {
        const embed = responseUtils
          .invalidParameter({ discordUser: this.message.author })
          .setDescription(this.formatMessage("commandHelpInvalidPageIndex"));

        return await this.message.channel.send(embed);
      }

      const startIndex = (pageIndex - 1) * COMMAND_AMOUNT_PER_PAGE;
      const menuCommands = combinesCommands
        .slice(startIndex)
        .slice(0, COMMAND_AMOUNT_PER_PAGE);

      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setTitle(
          this.formatMessage("commandHelpTitlePage", {
            pageIndex,
          }),
        )
        .setDescription(
          this.formatMessage("commandHelpGetMoreInfo", { prefix }),
        );

      if (isPrevPage) {
        embed.addField(
          this.formatMessage("commandHelpPreviousPage"),
          this.formatMessage("commandHelpPreviousPageWithIndex", {
            prefix,
            pageIndex: pageIndex - 1,
          }),
          false,
        );
      }

      embed.addFields(
        menuCommands.map((command) => ({
          name: command.isAdmin
            ? this.formatMessage("commandHelpCommandTitleAdmin", {
                emoji: command.emoji,
                commandName: this.formatMessage(command.name),
              })
            : this.formatMessage("commandHelpCommandTitle", {
                emoji: command.emoji,
                commandName: this.formatMessage(command.name),
              }),
          value: this.formatMessage("commandHelpCommandSpecificHelp", {
            prefix,
            command: command.command,
          }),
          inline: true,
        })),
      );

      if (isNextPage) {
        embed.addField(
          this.formatMessage("commandHelpNextPage"),
          this.formatMessage("commandHelpNextPageWithIndex", {
            prefix,
            pageIndex: pageIndex + 1,
          }),
          false,
        );
      }

      return await this.message.channel.send(embed);
    }
  }
}

export const helpCommand: Command = {
  emoji: "📖",
  name: validateFormatMessageKey("commandHelpMetaName"),
  description: validateFormatMessageKey("commandHelpMetaDescription"),
  command: "help",
  aliases: ["heelp", "commands"],
  syntax: "<command?>",
  examples: ["", "help"],
  isAdmin: false,

  getCommand(payload) {
    return new HelpCommand(payload);
  },
};
