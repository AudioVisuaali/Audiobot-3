import { Command } from "discord.js";

export const yoMamaCommand: Command = {
  name: "Yo mama!",
  command: "yomama",
  aliases: ["yomomma"],
  description: "Yo mama so fat",

  async execute(message, _, { services }) {
    const joke = await services.jokesServices.getYoMamaJoke();
    message.channel.send(joke);
  },
};
