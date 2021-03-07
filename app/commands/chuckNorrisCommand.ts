import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class ChuckNorrisCommand extends AbstractCommand {
  async execute() {
    const chuckNorris = await this.services.jokes.getChuckNorrisJoke();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(chuckNorris.value.joke);

    await this.message.channel.send(embed);
  }
}

export const chuckNorrisCommand: Command = {
  emoji: "👨🏻",
  name: "Chuck Norris",
  command: "chucknorris",
  aliases: ["chuck", "norris", "cn"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random Chuck Norris joke",

  getCommand(payload) {
    return new ChuckNorrisCommand(payload);
  },
};
