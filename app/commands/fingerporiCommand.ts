import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
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
  name: "Fingerpori",
  command: "fingerpori",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random fingerpori",

  getCommand(payload) {
    return new FingerporiCommand(payload);
  },
};
