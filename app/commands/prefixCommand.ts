import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

const PREFIX_MAX_LENGTH = 15;

class PrefixCommand extends AbstractCommand {
  public async execute() {
    if (this.message.guild.ownerID !== this.message.author.id) {
      return;
    }

    const { prefix } = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    if (this.args.length === 0) {
      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandPrefixTitle"))
        .addField(
          this.formatMessage("commandPrefixDescription"),
          this.formatMessage("commandPrefixExampleWithValue", {
            prefix,
          }),
        );

      return await this.message.channel.send(embed);
    }

    const newPrefix = this.args.join(" ");

    if (newPrefix.length > PREFIX_MAX_LENGTH) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandPrefixTitleError"))
        .setDescription(this.formatMessage("commandPrefixDescriptionTooLong"))
        .addField(this.formatMessage("commandPrefixfieldTooLong"), newPrefix);

      return await this.message.channel.send(embed);
    }

    await this.dataSources.guildDS.modifyGuild({
      guildDiscordId: this.message.guild.id,
      newPrefix: newPrefix,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandPrefixTitleUpdated"))
      .addField(this.formatMessage("commandPrefixNewPrefix"), newPrefix)
      .addField(
        this.formatMessage("commandPrefixExampleUsage"),
        this.formatMessage("commandPrefixExample", {
          prefix: newPrefix,
        }),
      );

    await this.message.channel.send(embed);
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
