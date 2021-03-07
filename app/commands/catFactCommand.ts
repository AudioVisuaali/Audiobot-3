import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class CatFactCommand extends AbstractCommand {
  async execute() {
    const catfact = await this.services.animal.getCatFact();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandCatFactTitle"))
      .setDescription(catfact.fact);

    await this.message.channel.send(embed);
  }
}

export const catFactCommand: Command = {
  emoji: "🐱",
  name: "Cat Fact",
  command: "catfact",
  aliases: ["catf"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random catfact",

  getCommand(payload) {
    return new CatFactCommand(payload);
  },
};
