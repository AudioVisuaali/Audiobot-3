import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class DogFactCommand extends AbstractCommand {
  public async execute() {
    const dogfact = await this.services.animal.getDogFact();

    if (!dogfact.facts.length) {
      return;
    }

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandDogFactTitle"))
      .setDescription(dogfact.facts[0]);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const dogFactCommand: Command = {
  emoji: "🐶",
  name: validateFormatMessageKey("commandDogFactMetaName"),
  description: validateFormatMessageKey("commandDogFactMetaDescription"),
  command: "dogfact",
  aliases: ["dogf"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new DogFactCommand(payload);
  },
};
