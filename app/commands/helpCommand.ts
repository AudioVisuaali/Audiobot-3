import { Command, commands } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

type SortedModules = {
  commands: Command[];
  adminCommands: Command[];
};

export const sortedModules = commands.reduce<SortedModules>(
  (prev, curr) => ({
    commands: curr.isAdmin ? prev.commands : [...prev.commands, curr],
    adminCommands: curr.isAdmin
      ? [...prev.adminCommands, curr]
      : prev.adminCommands,
  }),
  { commands: [], adminCommands: [] },
);

export const helpCommand: Command = {
  name: "Help",
  command: "help",
  aliases: ["heelp"],
  syntax: "<command?>",
  examples: ["", "help"],
  isAdmin: false,
  description: "Help menu",

  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    const { prefix } = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    if (args.length === 0) {
      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setTitle("Help")
        .setDescription(
          `You can get more info by doing ${prefix}help <command>`,
        );

      for (const command of sortedModules.commands) {
        embed.addField(command.name, `${prefix}help ${command.command}`, true);
      }

      // TODO List cutsout at 25 embed.field limit
      if (message.guild.ownerID === message.author.id) {
        // embed.addField("Admin commands", "a", false);

        for (const command of sortedModules.adminCommands) {
          embed.addField(
            command.name,
            `${prefix}help ${command.command}`,
            true,
          );
        }
      }

      return message.channel.send(embed);
    }

    const [moduleName] = args;

    const command = commands.find(
      (command) =>
        command.command === moduleName ||
        command.aliases.find((alias) => alias === moduleName),
    );

    if (!command) {
      const embed = responseUtils
        .negative({ discordUser: message.author })
        .setTitle(`Help => ${moduleName}`)
        .setDescription(`Could not find module: ${args[0]}`);

      return message.channel.send(embed);
    }

    const examples = command.examples.length
      ? command.examples
          .map((example) => `${prefix}${command.command} ${example}`)
          .join("\n")
      : `${prefix}${command.command}`;

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`Help => ${command.name}`)
      .setDescription(command.description)
      .addField("Syntax", `${prefix}${command.command} ${command.syntax}`)
      .addField("Examples", examples);

    if (command.aliases.length) {
      embed.addField("Aliases", command.aliases.join("\n"));
    }

    message.channel.send(embed);
  },
};
