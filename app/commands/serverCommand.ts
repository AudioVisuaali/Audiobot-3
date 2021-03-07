import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class ServerCommand extends AbstractCommand {
  public async execute() {
    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setAuthor(
        this.message.guild.name,
        this.message.guild.iconURL() ?? undefined,
      )
      .addField(
        this.formatMessage("commandServerVerificationLeve"),
        this.message.guild.verificationLevel,
        true,
      )
      .addField(
        this.formatMessage("commandServerRegion"),
        this.message.guild.region,
        true,
      )
      .addField(
        this.formatMessage("commandServerUsers"),
        this.message.guild.memberCount,
        true,
      )
      // .addField("Channels -> categories,text,voice")
      .addField(
        this.formatMessage("commandServerLargeServer"),
        this.message.guild.large,
        true,
      )
      .addField(
        this.formatMessage("commandServerPartnered"),
        this.message.guild.partnered ? "True" : "False",
        true,
      )
      // .addField("Emojis", message.guild.emojis, true) // Count
      .addField(
        this.formatMessage("commandServerOwner"),
        this.message.guild?.owner?.nickname ?? "Unknown",
        true,
      )
      .addField(
        this.formatMessage("commandServerCreatedAt"),
        this.message.guild.createdAt,
        true,
      );
    // .addField("Roles", message.guild.roles, true);

    const serverUrl = this.message.guild.iconURL();
    if (serverUrl) {
      embed.setThumbnail(serverUrl);
    }

    await this.message.channel.send(embed);
  }
}

export const serverCommand: Command = {
  emoji: "📝",
  name: "Server Info",
  command: "serverinfo",
  aliases: ["server"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get information about the server",

  getCommand(payload) {
    return new ServerCommand(payload);
  },
};
