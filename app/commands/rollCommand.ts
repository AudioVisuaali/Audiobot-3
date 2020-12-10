import { Command } from "discord.js";

export const rollCommand: Command = {
  name: "Roll",
  command: "roll",
  aliases: [],
  description: "Roll a random number",

  async execute(message, args, context) {
    const numbers = args.map((arg) => {
      const number = context.utils.mathUtils.parseStringToNumber(arg);

      if (number === null) {
        throw new Error("invalid number");
      }

      return number;
    });

    switch (numbers.length) {
      case 0:
        return message.channel.send(
          `**:game_die: ${context.utils.mathUtils.getRandomArbitrary(0, 99)}**`,
        );

      case 1:
        return message.channel.send(
          `**:game_die: ${context.utils.mathUtils.getRandomArbitrary(
            0,
            numbers[0],
          )}**`,
        );

      case 2:
        return message.channel.send(
          `**:game_die: ${context.utils.mathUtils.getRandomArbitrary(
            numbers[0],
            numbers[1],
          )}**`,
        );

      default:
    }
  },
};
