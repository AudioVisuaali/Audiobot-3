import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class ReverseCommand extends AbstractCommand {
  public async execute() {
    const letter = this.args.join(" ").split("").reverse().join("");

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(letter);

    await this.message.channel.send(embed);
  }
}

export const reverseCommand: Command = {
  emoji: "🔁",
  name: validateFormatMessageKey("commandReverseMetaName"),
  description: validateFormatMessageKey("commandReverseMetaDescription"),
  command: "reverse",
  aliases: [],
  syntax: "<sentence>",
  examples: ["anything goes here"],
  isAdmin: false,

  getCommand(payload) {
    return new ReverseCommand(payload);
  },
};
