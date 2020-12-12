import { Command } from "discord.js";

export const reverseCommand: Command = {
  name: "Reverse",
  command: "reverse",
  aliases: [],
  syntax: "<sentence>",
  examples: ["anything goes here"],
  isAdmin: false,
  description: "Reverse anything",

  async execute(message, args, { utils }) {
    const letter = args.join(" ").split("").reverse().join("");

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setDescription(letter);

    message.channel.send(embed);
  },
};
