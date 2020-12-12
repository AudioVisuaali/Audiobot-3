import { MessageEmbed, Command } from "discord.js";

export const numberfactCommand: Command = {
  name: "NumberFact",
  command: "numberfact",
  aliases: ["number"],
  description: "Get facts for numbers",

  async execute(message, args, { utils, services }) {
    if (args.length === 0) {
      return message.channel.send("No number was provided");
    }

    const number = utils.math.parseStringToNumber(args[0]);

    if (number === null) {
      return message.channel.send("Invalid number");
    }

    const fact = await services.stats.getNumerFact({ number });

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle(`Numberfact #${number}`)
      .setDescription(fact)
      .setTimestamp();

    message.channel.send(embed);
  },
};
