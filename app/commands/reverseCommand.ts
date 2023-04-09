import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class ReverseCommand extends AbstractCommand {
  public async execute() {
    const letter = this.args.join(" ").split("").reverse().join("");

    if (letter.length === 0) {
      return await this.message.channel.send(
        this.formatMessage("commandReverseProvideMessage"),
      );
    }

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(letter);

    return await this.message.channel.send({ embeds: [embed] });
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
