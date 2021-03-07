import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class DogFactCommand extends AbstractCommand {
  public async execute() {
    const dogfact = await this.services.animal.getDogFact();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandDogFactTitle"))
      .setDescription(dogfact.facts[0]);

    await this.message.channel.send(embed);
  }
}

export const dogFactCommand: Command = {
  emoji: "🐶",
  name: "Dog Fact",
  command: "dogfact",
  aliases: ["dogf"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random dog fact",

  getCommand(payload) {
    return new DogFactCommand(payload);
  },
};
