import { Command } from "discord.js";

import { responseUtils } from "~/utils/responseUtils";

export const yoMamaCommand: Command = {
  name: "Yo mama",
  command: "yomama",
  aliases: ["mama"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Yo mama so fat",

  async execute(message, _, { services }) {
    const joke = await services.jokes.getYoMamaJoke();

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setDescription(joke);

    message.channel.send(embed);
  },
};
