import { validateFormatMessageKey } from "../translations/formatter";
import { fingerporiUtils } from "../utils/fingerporiUtils";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class FingerporiCommand extends AbstractCommand {
  public async execute() {
    const fingerporiURL = fingerporiUtils.getRandomFingerPori();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setImage(fingerporiURL);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const fingerporiCommand: Command = {
  emoji: "🤔",
  name: validateFormatMessageKey("commandFingerporiMetaName"),
  description: validateFormatMessageKey("commandFingerporiMetaDescription"),
  command: "fingerpori",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new FingerporiCommand(payload);
  },
};
