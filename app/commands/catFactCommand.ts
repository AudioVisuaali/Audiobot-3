import { MessageEmbed, Command } from "discord.js";

export const catFactCommand: Command = {
  name: "Cat facts!",
  command: "catfact",
  aliases: ["catf"],
  description: "Get a random catfact",

  async execute(message, _, { services }) {
    const catfact = await services.animal.getCatFact();

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle("Random cat fact!")
      .setDescription(catfact.fact)
      .setTimestamp();

    message.channel.send(embed);
  },
};
