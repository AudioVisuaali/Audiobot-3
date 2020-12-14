import { Command } from "~/commands/commands";
import { mathUtils } from "~/utils/mathUtil";

export const rollCommand: Command = {
  name: "Roll",
  command: "roll",
  aliases: [],
  syntax: "<numberMax> | <numberMin> <numberMax>",
  examples: ["42", "44 880"],
  isAdmin: false,
  description: "Roll a random number",

  async execute(message, args) {
    const numbers = args.map((arg) => {
      const number = mathUtils.parseStringToNumber(arg);

      if (number === null) {
        throw new Error("invalid number");
      }

      return number;
    });

    switch (numbers.length) {
      case 0:
        return message.channel.send(
          `**:game_die: ${mathUtils.getRandomArbitrary(0, 99)}**`,
        );

      case 1:
        return message.channel.send(
          `**:game_die: ${mathUtils.getRandomArbitrary(0, numbers[0])}**`,
        );

      case 2:
        return message.channel.send(
          `**:game_die: ${mathUtils.getRandomArbitrary(
            numbers[0],
            numbers[1],
          )}**`,
        );

      default:
    }
  },
};
