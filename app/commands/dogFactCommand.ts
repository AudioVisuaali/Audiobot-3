import { Command } from "discord.js";

export const dogFactCommand: Command = {
  name: "Dog facts!",
  command: "dogfact",
  aliases: ["dogf"],
  description: "Get a random dog fact",

  async execute(message, _, { services, utils }) {
    const dogfact = await services.animal.getDogFact();

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle("Random dog fact!")
      .setDescription(dogfact.facts[0]);

    message.channel.send(embed);
  },
};
