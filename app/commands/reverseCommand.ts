import { Command } from "discord.js";

export const reverseCommand: Command = {
  name: "Reverse!",
  command: "reverse",
  aliases: [],
  description: "Reverse anything",

  async execute(message, args) {
    const letter = args.join(" ").split("").reverse().join("");

    message.channel.send(`**:arrows_counterclockwise: ${letter}**`);
  },
};
