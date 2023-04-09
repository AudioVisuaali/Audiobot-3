import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class PunCommand extends AbstractCommand {
  public async execute() {
    const pun = await this.services.jokes.getPun();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(pun.Pun);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const punCommand: Command = {
  emoji: "✊",
  name: validateFormatMessageKey("commandPunMetaName"),
  description: validateFormatMessageKey("commandPunMetaDescription"),
  command: "pun",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new PunCommand(payload);
  },
};
