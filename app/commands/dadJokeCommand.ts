import { Command } from "discord.js";

import { responseUtils } from "~/utils/responseUtils";

export const dadJokeCommand: Command = {
  name: "Dad Joke",
  command: "dadjoke",
  aliases: ["dad"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random dad joke",

  async execute(message, _, { services }) {
    const dadJoke = await services.jokes.getDadJoke();

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle("Dad joke!")
      .setDescription(dadJoke.attachments[0].text);

    message.channel.send(embed);
  },
};
