import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const reverseCommand: Command = {
  name: "Reverse",
  command: "reverse",
  aliases: [],
  syntax: "<sentence>",
  examples: ["anything goes here"],
  isAdmin: false,
  description: "Reverse anything",

  async execute(message, args) {
    const letter = args.join(" ").split("").reverse().join("");

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setDescription(letter);

    message.channel.send(embed);
  },
};
