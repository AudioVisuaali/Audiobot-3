import { Command } from "discord.js";

export const punCommand: Command = {
  name: "Puns!",
  command: "pun",
  aliases: [],
  description: "Get a random pun",

  async execute(message, _, { services, utils }) {
    const pun = await services.jokes.getPun();

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setDescription(pun.Pun);

    message.channel.send(embed);
  },
};
