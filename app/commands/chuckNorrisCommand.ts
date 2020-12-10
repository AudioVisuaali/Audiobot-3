import { MessageEmbed, Command } from "discord.js";

export const chuckNorrisCommand: Command = {
  name: "Chuck Norris!",
  command: "chucknorris",
  aliases: ["chuck", "norris", "cn"],
  description: "Get a random Chuck Norris joke",

  async execute(message, _, context) {
    const chuckNorris = await context.services.jokesServices.getChuckNorrisJoke();

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle("Chuck norris joke!")
      .setDescription(chuckNorris.value.joke)
      .setTimestamp();

    message.channel.send(embed);
  },
};
