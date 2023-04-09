import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class BoredCommand extends AbstractCommand {
  public async execute() {
    const activity = await this.services.stats.getBoredActivity();
    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandBoredMetaTitle"))
      .setDescription(activity.activity);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const boredCommand: Command = {
  emoji: "💤",
  name: validateFormatMessageKey("commandBoredMetaName"),
  description: validateFormatMessageKey("commandBoredMetaDescription"),
  command: "bored",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new BoredCommand(payload);
  },
};
