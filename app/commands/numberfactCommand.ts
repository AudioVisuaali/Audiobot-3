import { MessageEmbed, Command } from "discord.js";

export const numberfactCommand: Command = {
  name: "NumberFact",
  command: "numberfact",
  aliases: ["number"],
  description: "Get facts for numbers",

  async execute(message, args, context) {
    if (args.length === 0) {
      return message.channel.send("No number was provided");
    }

    const number = context.utils.mathUtils.parseStringToNumber(args[0]);

    if (number === null) {
      return message.channel.send("Invalid number");
    }

    const fact = await context.services.statsService.getNumerFact({ number });

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle(`Numberfact #${number}`)
      .setDescription(fact)
      .setTimestamp();

    message.channel.send(embed);
  },
};
