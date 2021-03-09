import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class ChuckNorrisCommand extends AbstractCommand {
  public async execute() {
    const chuckNorris = await this.services.jokes.getChuckNorrisJoke();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(chuckNorris.value.joke);

    await this.message.channel.send(embed);
  }
}

export const chuckNorrisCommand: Command = {
  emoji: "👨🏻",
  name: validateFormatMessageKey("commandChuckNorrisMetaName"),
  description: validateFormatMessageKey("commandChuckNorrisMetaDescription"),
  command: "chucknorris",
  aliases: ["chuck", "norris", "cn"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new ChuckNorrisCommand(payload);
  },
};
