import { validateFormatMessageKey } from "../translations/formatter";
import { mathUtils } from "../utils/mathUtil";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class NumberFactCommand extends AbstractCommand {
  public async execute() {
    if (this.args.length === 0) {
      return this.message.channel.send(
        this.formatMessage("errorNoNumberWasProvided"),
      );
    }

    const number = mathUtils.parseStringToNumber(this.args[0]);

    if (number === null) {
      return this.message.channel.send(
        this.formatMessage("errorInvalidNumber"),
      );
    }

    const fact = await this.services.stats.getNumerFact({ number });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandNumberFactTitle", { number }))
      .setDescription(fact);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const numberfactCommand: Command = {
  emoji: "🔢",
  name: validateFormatMessageKey("commandNumberFactMetaName"),
  description: validateFormatMessageKey("commandNumberFactMetaDescription"),
  command: "numberfact",
  aliases: ["number"],
  syntax: "<number>",
  examples: ["69"],
  isAdmin: false,

  getCommand(payload) {
    return new NumberFactCommand(payload);
  },
};
