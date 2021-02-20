import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const dadJokeCommand: Command = {
  emoji: "👨",
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
      .setTitle("👨 Dad joke!")
      .setDescription(dadJoke.attachments[0].text);

    await message.channel.send(embed);
  },
};
