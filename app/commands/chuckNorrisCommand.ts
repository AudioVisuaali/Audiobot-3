import { Command } from "discord.js";

import { responseUtils } from "~/utils/responseUtils";

export const chuckNorrisCommand: Command = {
  name: "Chuck Norris",
  command: "chucknorris",
  aliases: ["chuck", "norris", "cn"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random Chuck Norris joke",

  async execute(message, _, { services }) {
    const chuckNorris = await services.jokes.getChuckNorrisJoke();

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setDescription(chuckNorris.value.joke);

    message.channel.send(embed);
  },
};
