import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const catFactCommand: Command = {
  emoji: "🐱",
  name: "Cat Fact",
  command: "catfact",
  aliases: ["catf"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random catfact",

  async execute(message, _, { services }) {
    const catfact = await services.animal.getCatFact();

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle("Random cat fact!")
      .setDescription(catfact.fact);

    await message.channel.send(embed);
  },
};
