import { MessageEmbed, Command } from "discord.js";

export const dogFactCommand: Command = {
  name: "Dog facts!",
  command: "dogfact",
  aliases: ["dogf"],
  description: "Get a random dog fact",

  async execute(message, _, context) {
    const dogfact = await context.services.animalService.getDogFact();

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle("Random dog fact!")
      .setDescription(dogfact.facts[0])
      .setTimestamp();

    message.channel.send(embed);
  },
};
