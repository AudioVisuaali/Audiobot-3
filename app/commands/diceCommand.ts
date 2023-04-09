import { validateFormatMessageKey } from "../translations/formatter";
import { mathUtils } from "../utils/mathUtil";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class DiceCommand extends AbstractCommand {
  public async execute() {
    if (this.args.length > 1) {
      return;
    }

    if (this.args.length === 0) {
      const rolled = mathUtils.getRandomArbitrary(1, 6);

      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setDescription(
          this.formatMessage("commandDiceTitle", { number: rolled }),
        );

      return await this.message.channel.send({ embeds: [embed] });
    }

    const maxValue = mathUtils.parseStringToNumber(this.args[0]);

    if (maxValue === null) {
      return await this.message.channel.send(
        this.formatMessage("commandDiceInvalidNumber"),
      );
    }

    const number = mathUtils.getRandomArbitrary(1, maxValue);

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(this.formatMessage("commandDiceTitle", { number }));

    return await this.message.channel.send({ embeds: [embed] });
  }
}

export const diceCommand: Command = {
  emoji: "🎲",
  name: validateFormatMessageKey("commandDiceMetaName"),
  description: validateFormatMessageKey("commandDiceMetaDescription"),
  command: "dice",
  aliases: [],
  syntax: "<maxValue?>",
  examples: ["", "10"],
  isAdmin: false,

  getCommand(payload) {
    return new DiceCommand(payload);
  },
};
