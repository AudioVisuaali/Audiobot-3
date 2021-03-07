import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";

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
      case "delete":
        return this.handleDelete();

      case "current":
        return this.handleCurrent();

      case "set":
        return this.handleSet();
    }
  }

  private async handleDelete() {
    await this.dataSources.guildDS.modifyGuild({
      guildDiscordId: this.message.guild.id,
      newCasinoChannelId: null,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle("Admin / Casino")
      .setDescription("Casino room has ben succesfully removed");

    return await this.message.channel.send(embed);
  }

  private async handleCurrent() {
    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle("Admin / Casino")
      .addField(
        "Current casino channel",
        guild.casinoChannelId ? `<#${guild.casinoChannelId}>` : "_None_",
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

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle("Admin / Casino")
      .setDescription("Casino channel updated for server")
      .addField(
        "Current casino channel",
        modifiedGuild.casinoChannelId
          ? `<#${modifiedGuild.casinoChannelId}>`
          : modifiedGuild.casinoChannelId,
      );

    return await this.message.channel.send(embed);
  }
}

export const casinoCommand: Command = {
  emoji: "🎰",
  name: "Casino",
  command: "casino",
  aliases: [],
  syntax: "delete | current | <set> <#channel>",
  examples: [],
  isAdmin: true,
  description: "Admin tool for settings casino",

  getCommand(payload) {
    return new CasinoCommand(payload);
  },
};
