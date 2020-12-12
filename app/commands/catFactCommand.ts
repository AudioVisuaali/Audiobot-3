import { Command } from "discord.js";

import { responseUtils } from "~/utils/responseUtils";

export const catFactCommand: Command = {
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

    message.channel.send(embed);
  },
};
