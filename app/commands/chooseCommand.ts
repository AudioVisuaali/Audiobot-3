import { Command } from "discord.js";

export const chooseCommand: Command = {
  name: "Choose Option",
  command: "choose",
  aliases: ["option"],
  syntax: "[<option>]",
  examples: ["car | house | flower"],
  isAdmin: false,
  description: "Choose a random option",

  async execute(message, args, { utils }) {
    const options = args.join("").split("|");

    if (options.length === 0) {
      const embed = utils.response
        .negative({ discordUser: message.author })
        .setDescription("You need to provide options");

      return message.channel.send(embed);
    }

    const position = utils.math.getRandomArbitrary(0, options.length - 1);

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle(`I choose ${options[position]}`);

    message.channel.send(embed);
  },
};
