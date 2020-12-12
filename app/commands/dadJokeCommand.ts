import { Command } from "discord.js";

export const dadJokeCommand: Command = {
  name: "Dad joke!",
  command: "dadjoke",
  aliases: ["dad"],
  description: "Get a random dad joke",

  async execute(message, _, { services, utils }) {
    const dadJoke = await services.jokes.getDadJoke();

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle("Dad joke!")
      .setDescription(dadJoke.attachments[0].text);

    message.channel.send(embed);
  },
};
