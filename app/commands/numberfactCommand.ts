import { Command } from "~/commands/commands";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const numberfactCommand: Command = {
  name: "NumberFact",
  command: "numberfact",
  aliases: ["number"],
  syntax: "<number>",
  examples: ["69"],
  isAdmin: false,
  description: "Get facts for numbers",

  async execute(message, args, { services }) {
    if (args.length === 0) {
      return message.channel.send("No number was provided");
    }

    const number = mathUtils.parseStringToNumber(args[0]);

    if (number === null) {
      return message.channel.send("Invalid number");
    }

    const fact = await services.stats.getNumerFact({ number });

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`Numberfact #${number}`)
      .setDescription(fact);

    message.channel.send(embed);
  },
};
