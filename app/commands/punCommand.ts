import { Command } from "discord.js";

import { responseUtils } from "~/utils/responseUtils";

export const punCommand: Command = {
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

    message.channel.send(embed);
  },
};
