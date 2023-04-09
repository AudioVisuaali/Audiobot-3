import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class ServerCommand extends AbstractCommand {
  public async execute() {
    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setAuthor({
        name: this.message.guild.name,
        iconURL: this.message.guild.iconURL() ?? undefined,
      })
      .addFields([
        {
          name: this.formatMessage("commandServerVerificationLeve"),
          value: this.message.guild.verificationLevel.toString(),
          inline: true,
        },
        {
          name: this.formatMessage("commandServerUsers"),
          value: this.message.guild.memberCount.toString(),
          inline: true,
        },
        {
          name: this.formatMessage("commandServerLargeServer"),
          value: this.message.guild.large ? "True" : "False",
          inline: true,
        },
        {
          name: this.formatMessage("commandServerPartnered"),
          value: this.message.guild.partnered ? "True" : "False",
          inline: true,
        },
        {
          name: this.formatMessage("commandServerCreatedAt"),
          value: this.message.guild.createdAt.toISOString(),
          inline: true,
        },
      ]);
    // .addField("Emojis", message.guild.emojis, true) // Count
    // .addField(
    //   this.formatMessage("commandServerOwner"),
    //   this.message.guild?.fetchOwner()?.nickname ?? "Unknown",
    //   true,
    // )
    // .addField("Roles", message.guild.roles, true);

    const serverUrl = this.message.guild.iconURL();
    if (serverUrl) {
      embed.setThumbnail(serverUrl);
    }

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const serverCommand: Command = {
  emoji: "📝",
  name: validateFormatMessageKey("commandServerMetaName"),
  description: validateFormatMessageKey("commandServerMetaDesription"),
  command: "serverinfo",
  aliases: ["server"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new ServerCommand(payload);
  },
};
