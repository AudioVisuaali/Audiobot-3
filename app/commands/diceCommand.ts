import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

class DiceCommand extends AbstractCommand {
  async execute() {
    if (this.args.length === 0) {
      const rolled = mathUtils.getRandomArbitrary(1, 6);

      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setDescription(
          this.formatMessage("commandDiceTitle", { number: rolled }),
        );

      return await this.message.channel.send(embed);
    }

    const maxValue = mathUtils.parseStringToNumber(this.args[0]);

    if (maxValue === null) {
      return await this.message.channel.send(":game_die: **| Invalid number**");
    }

    const rolled = mathUtils.getRandomArbitrary(1, maxValue);

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(`🎲 Dice rolled ${rolled}`);

    return await this.message.channel.send(embed);
  }
}

export const diceCommand: Command = {
  emoji: "🎲",
  name: "Dice",
  command: "dice",
  aliases: [],
  syntax: "<maxValue?>",
  examples: ["", "10"],
  isAdmin: false,
  description: "Roll the dice",

  getCommand(payload) {
    return new DiceCommand(payload);
  },
};
