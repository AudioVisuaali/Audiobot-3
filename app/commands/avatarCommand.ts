import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class AvatarCommand extends AbstractCommand {
  public async execute() {
    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(
        this.formatMessage("commandAvatarTitle", {
          username: this.message.author.username,
        }),
      )
      .setImage(
        this.message.author.avatarURL({ size: 2048 }) ||
          this.message.author.defaultAvatarURL,
      );

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const avatarCommand: Command = {
  emoji: "📷",
  name: validateFormatMessageKey("commandAvatarMetaName"),
  description: validateFormatMessageKey("commandAvatarMetaDescription"),
  command: "avatar",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new AvatarCommand(payload);
  },
};
