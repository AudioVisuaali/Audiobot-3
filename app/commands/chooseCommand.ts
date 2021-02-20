import { Command } from "~/commands/commands";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const chooseCommand: Command = {
  emoji: "❓",
  name: "Choose Option",
  command: "choose",
  aliases: ["option"],
  syntax: "[<option>]",
  examples: ["car | house | flower"],
  isAdmin: false,
  description: "Choose a random option",

  async execute(message, args) {
    const options = args.join("").split("|");

    if (options.length === 0) {
      const embed = responseUtils
        .negative({ discordUser: message.author })
        .setDescription("You need to provide options");

      return await message.channel.send(embed);
    }

    const position = mathUtils.getRandomArbitrary(0, options.length - 1);

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`❓ I choose ${options[position]}`);

    await message.channel.send(embed);
  },
};
