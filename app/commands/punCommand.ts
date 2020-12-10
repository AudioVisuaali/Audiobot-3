import { MessageEmbed, Command } from "discord.js";

export const punCommand: Command = {
  name: "Puns!",
  command: "pun",
  aliases: [],
  description: "Get a random pun",

  async execute(message, _, context) {
    const pun = await context.services.jokesServices.getPun();

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle("Random pun!")
      .setDescription(pun.Pun)
      .setTimestamp();

    message.channel.send(embed);
  },
};
