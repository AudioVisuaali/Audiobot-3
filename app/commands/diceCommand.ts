import { Command } from "discord.js";

import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const diceCommand: Command = {
  name: "Dice",
  command: "dice",
  aliases: [],
  syntax: "<maxValue?>",
  examples: ["", "10"],
  isAdmin: false,
  description: "Roll the dice",

  execute(message, args) {
    if (args.length === 0) {
      const rolled = mathUtils.getRandomArbitrary(1, 6);

      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setDescription(`:game_die: Dice rolled ${rolled}`);

      return message.channel.send(embed);
    }

    const maxValue = mathUtils.parseStringToNumber(args[0]);

    if (maxValue === null) {
      return message.channel.send(":game_die: **| Invalid number**");
    }

    const rolled = mathUtils.getRandomArbitrary(1, maxValue);

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setDescription(`:game_die: Dice rolled ${rolled}`);

    return message.channel.send(embed);
  },
};
