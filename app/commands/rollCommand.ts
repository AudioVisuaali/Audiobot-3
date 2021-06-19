import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { mathUtils } from "~/utils/mathUtil";

class RollCommand extends AbstractCommand {
  private getRandomArbitaryMessage(params: { min?: number; max?: number }) {
    return this.formatMessage("commandRollReply", {
      number: mathUtils.getRandomArbitrary(params.min ?? 0, params.max ?? 99),
    });
  }

  private getMessage(numbers: number[]) {
    switch (numbers.length) {
      case 0:
        return this.getRandomArbitaryMessage({ min: 0, max: 99 });

      case 1:
        return this.getRandomArbitaryMessage({ min: 0, max: numbers[0] });

      case 2:
        return this.getRandomArbitaryMessage({
          min: numbers[0],
          max: numbers[1],
        });

      default:
        return null;
    }
  }

  public async execute() {
    const numbers = this.args.map((arg) => {
      const number = mathUtils.parseStringToNumber(arg);

      if (number === null) {
        throw new Error("invalid value");
      }

      return number;
    });

    const message = this.getMessage(numbers);

    if (!message) {
      return;
    }

    this.message.channel.send(message);
  }
}

export const rollCommand: Command = {
  emoji: "🎲",
  name: validateFormatMessageKey("commandRollMetaName"),
  description: validateFormatMessageKey("commandRollMetaDescription"),
  command: "roll",
  aliases: [],
  syntax: "<numberMax> | <numberMin> <numberMax>",
  examples: ["42", "44 880"],
  isAdmin: false,

  getCommand(payload) {
    return new RollCommand(payload);
  },
};
