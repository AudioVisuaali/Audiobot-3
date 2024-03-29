import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class YoMamaCommand extends AbstractCommand {
  public async execute() {
    const joke = await this.services.jokes.getYoMamaJoke();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(joke);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const yoMamaCommand: Command = {
  emoji: "👩",
  name: validateFormatMessageKey("commandYoMamaMetaName"),
  description: validateFormatMessageKey("commandYoMamaMetaDescription"),
  command: "yomama",
  aliases: ["mama"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new YoMamaCommand(payload);
  },
};
