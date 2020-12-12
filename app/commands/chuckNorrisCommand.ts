import { Command } from "discord.js";

export const chuckNorrisCommand: Command = {
  name: "Chuck Norris!",
  command: "chucknorris",
  aliases: ["chuck", "norris", "cn"],
  description: "Get a random Chuck Norris joke",

  async execute(message, _, { services, utils }) {
    const chuckNorris = await services.jokes.getChuckNorrisJoke();

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setDescription(chuckNorris.value.joke);

    message.channel.send(embed);
  },
};
