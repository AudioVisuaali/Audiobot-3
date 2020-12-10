import { Command } from "discord.js";

export const spongebobCommand: Command = {
  name: "Spongebob!",
  command: "sponbegog",
  aliases: ["retarded"],
  description: "Spongebob styled text",

  async execute(message, args) {
    const letter = args
      .join(" ")
      .split("")
      .map((character, index) =>
        index % 2 === 0
          ? character.toLocaleLowerCase()
          : character.toLocaleUpperCase(),
      )
      .join("");

    message.channel.send(`**:arrows_counterclockwise: ${letter}**`);
  },
};
