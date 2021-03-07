import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { mathUtils } from "~/utils/mathUtil";

class RollCommand extends AbstractCommand {
  private async sendRandomArbitary(params: { min?: number; max?: number }) {
    this.formatMessage("commandRollReply", {
      number: mathUtils.getRandomArbitrary(params.min ?? 0, params.max ?? 99),
    });
  }

  public async execute() {
    const numbers = this.args.map((arg) => {
      const number = mathUtils.parseStringToNumber(arg);

      if (number === null) {
        throw new Error("invalid value");
      }

      return number;
    });

    switch (numbers.length) {
      case 0:
        return await this.sendRandomArbitary({ min: 0, max: 99 });

      case 1:
        return await this.sendRandomArbitary({ min: 0, max: numbers[0] });

      case 2:
        return await this.sendRandomArbitary({
          min: numbers[0],
          max: numbers[1],
        });

      default:
    }
  }
}

export const rollCommand: Command = {
  emoji: "🎲",
  name: "Roll",
  command: "roll",
  aliases: [],
  syntax: "<numberMax> | <numberMin> <numberMax>",
  examples: ["42", "44 880"],
  isAdmin: false,
  description: "Roll a random number",

  getCommand(payload) {
    return new RollCommand(payload);
  },
};
