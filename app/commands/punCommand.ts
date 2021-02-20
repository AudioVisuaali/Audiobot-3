import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const punCommand: Command = {
  emoji: "✊",
  name: "Puns",
  command: "pun",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random pun",

  async execute(message, _, { services }) {
    const pun = await services.jokes.getPun();

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setDescription(pun.Pun);

    await message.channel.send(embed);
  },
};
