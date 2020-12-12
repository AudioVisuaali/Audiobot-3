import { Command } from "discord.js";

export const reverseCommand: Command = {
  name: "Reverse!",
  command: "reverse",
  aliases: [],
  description: "Reverse anything",

  async execute(message, args, { utils }) {
    const letter = args.join(" ").split("").reverse().join("");

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setDescription(letter);

    message.channel.send(embed);
  },
};
