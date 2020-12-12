import { Command } from "discord.js";

export const diceCommand: Command = {
  name: "Dice",
  command: "dice",
  aliases: [],
  description: "Roll the dice",

  execute(message, args, { utils }) {
    if (args.length === 0) {
      const rolled = utils.math.getRandomArbitrary(1, 6);

      return message.channel.send(`:game_die: **| Dice rolled ${rolled}**`);
    }

    const maxValue = utils.math.parseStringToNumber(args[0]);

    if (maxValue === null) {
      return message.channel.send(":game_die: **| Invalid number**");
    }

    const rolled = utils.math.getRandomArbitrary(1, maxValue);

    return message.channel.send(`:game_die: **| Dice rolled ${rolled}**`);
  },
};
