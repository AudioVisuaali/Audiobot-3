import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const yoMamaCommand: Command = {
  emoji: "👩",
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

    await message.channel.send(embed);
  },
};
