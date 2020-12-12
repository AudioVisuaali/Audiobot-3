import { Command } from "discord.js";

export const yoMamaCommand: Command = {
  name: "Yo mama!",
  command: "yomama",
  aliases: ["mama"],
  description: "Yo mama so fat",

  async execute(message, _, { services, utils }) {
    const joke = await services.jokes.getYoMamaJoke();

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setDescription(joke);

    message.channel.send(embed);
  },
};
