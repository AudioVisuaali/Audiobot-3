import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const dogFactCommand: Command = {
  name: "Dog Fact",
  command: "dogfact",
  aliases: ["dogf"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random dog fact",

  async execute(message, _, { services }) {
    const dogfact = await services.animal.getDogFact();

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle("Random dog fact!")
      .setDescription(dogfact.facts[0]);

    message.channel.send(embed);
  },
};
