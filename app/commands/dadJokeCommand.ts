import { MessageEmbed, Command } from "discord.js";

export const dadJokeCommand: Command = {
  name: "Dad joke!",
  command: "dadjoke",
  aliases: ["dad"],
  description: "Get a random dad joke",

  async execute(message, _, { services }) {
    const dadJoke = await services.jokes.getDadJoke();

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle("Dad joke!")
      .setDescription(dadJoke.attachments[0].text)
      .setTimestamp();

    message.channel.send(embed);
  },
};
