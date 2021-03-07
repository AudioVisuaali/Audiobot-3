import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
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

    await this.message.channel.send(embed);
  }
}

export const avatarCommand: Command = {
  emoji: "📷",
  name: "Avatar",
  command: "avatar",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Shows requesters avatar",

  getCommand(payload) {
    return new AvatarCommand(payload);
  },
};
