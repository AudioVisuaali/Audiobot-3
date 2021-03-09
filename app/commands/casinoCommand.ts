import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";

enum CommandType {
  Delete = "delete",
  Current = "current",
  Set = "set",
}

class CasinoCommand extends AbstractCommand {
  private hasPermission() {
    return this.message.author.id === this.message.guild.ownerID;
  }

  public async execute() {
    if (!this.hasPermission()) {
      const embed = responseUtils.invalidPermissions({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    if (this.args.length < 1) {
      return;
    }

    switch (this.args[0]) {
      case CommandType.Delete:
        return this.handleDelete();

      case CommandType.Current:
        return this.handleCurrent();

      case CommandType.Set:
        return this.handleSet();

      default:
    }
  }

  private createEmbed() {
    return responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandCasinoTitle"));
  }

  private async handleDelete() {
    await this.dataSources.guildDS.modifyGuild({
      guildDiscordId: this.message.guild.id,
      newCasinoChannelId: null,
    });

    const embed = this.createEmbed().setDescription(
      this.formatMessage("commandCasinoRoomRemoved"),
    );

    return await this.message.channel.send(embed);
  }

  private async handleCurrent() {
    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const channelQuote = responseUtils.quoteCasinoChannel({
      guild,
      formatMessage: this.formatMessage,
    });

    const embed = this.createEmbed().addField(
      this.formatMessage("commandCasinoCurrentChannel"),
      channelQuote,
    );

    return await this.message.channel.send(embed);
  }

  private async handleSet() {
    if (this.args.length !== 2) {
      const embed = responseUtils.invalidParameter({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    const channelMention = inputUtils.getChannelMention({
      message: this.message,
      mentionInString: this.args[1],
    });

    if (!channelMention) {
      const embed = responseUtils.invalidReferenceChannel({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    if (channelMention.guild.id !== this.message.guild.id) {
      const embed = responseUtils.invalidReferenceChannel({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    const modifiedGuild = await this.dataSources.guildDS.modifyGuild({
      guildDiscordId: this.message.guild.id,
      newCasinoChannelId: channelMention.id,
    });

    const channelQuote = responseUtils.quoteCasinoChannel({
      guild: modifiedGuild,
      formatMessage: this.formatMessage,
    });

    const embed = this.createEmbed()
      .setDescription(this.formatMessage("commandCasinoChannelUpdated"))
      .addField(
        this.formatMessage("commandCasinoCurrentChannel"),
        channelQuote,
      );

    return await this.message.channel.send(embed);
  }
}

export const casinoCommand: Command = {
  emoji: "🎰",
  name: validateFormatMessageKey("commandCasinoMetaName"),
  description: validateFormatMessageKey("commandCasinoMetaDescription"),
  command: "casino",
  aliases: [],
  syntax: "delete | current | <set> <#channel>",
  examples: [],
  isAdmin: true,

  getCommand(payload) {
    return new CasinoCommand(payload);
  },
};
