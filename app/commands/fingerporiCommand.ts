import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { fingerporiUtils } from "~/utils/fingerporiUtils";
import { responseUtils } from "~/utils/responseUtils";

class FingerporiCommand extends AbstractCommand {
  public async execute() {
    const fingerporiURL = fingerporiUtils.getRandomFingerPori();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setImage(fingerporiURL);

    await this.message.channel.send(embed);
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
