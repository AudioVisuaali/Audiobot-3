import { Command } from "discord.js";

export const diceCommand: Command = {
  name: "Dice",
  command: "dice",
  aliases: [],
  description: "Roll the dice",
  execute(message, args, context) {
    if (args.length === 0) {
      const rolled = context.utils.mathUtils.getRandomArbitrary(1, 6);

      return message.channel.send(`:game_die: **| Dice rolled ${rolled}**`);
    }

    const maxValue = context.utils.mathUtils.parseStringToNumber(args[0]);

    if (maxValue === null) {
      return message.channel.send(":game_die: **| Invalid number**");
    }

    const rolled = context.utils.mathUtils.getRandomArbitrary(1, maxValue);

    return message.channel.send(`:game_die: **| Dice rolled ${rolled}**`);
  },
};
