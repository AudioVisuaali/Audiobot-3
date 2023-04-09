import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

const PREFIX_MAX_LENGTH = 15;

class PrefixCommand extends AbstractCommand {
  public async execute() {
    if (this.message.guild.ownerId !== this.message.author.id) {
      return;
    }

    const { prefix } = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    if (this.args.length === 0) {
      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandPrefixTitle"))
        .addFields({
          name: this.formatMessage("commandPrefixDescription"),
          value: this.formatMessage("commandPrefixExampleWithValue", {
            prefix,
          }),
        });

      return await this.message.channel.send({ embeds: [embed] });
    }

    const newPrefix = this.args.join(" ");

    if (newPrefix.length > PREFIX_MAX_LENGTH) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandPrefixTitleError"))
        .setDescription(this.formatMessage("commandPrefixDescriptionTooLong"))
        .addFields({
          name: this.formatMessage("commandPrefixfieldTooLong"),
          value: newPrefix,
        });

      return await this.message.channel.send({ embeds: [embed] });
    }

    await this.dataSources.guildDS.modifyGuild({
      guildDiscordId: this.message.guild.id,
      newPrefix: newPrefix,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandPrefixTitleUpdated"))
      .addFields([
        {
          name: this.formatMessage("commandPrefixNewPrefix"),
          value: newPrefix,
        },
        {
          name: this.formatMessage("commandPrefixExampleUsage"),
          value: this.formatMessage("commandPrefixExample", {
            prefix: newPrefix,
          }),
        },
      ]);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const prefixCommand: Command = {
  emoji: "⚛️",
  name: validateFormatMessageKey("commandPrefixMetaName"),
  description: validateFormatMessageKey("commandPrefixMetaDescription"),
  command: "prefix",
  aliases: [],
  syntax: "<value>",
  examples: ["#"],
  isAdmin: true,

  getCommand(payload) {
    return new PrefixCommand(payload);
  },
};
