import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

const spongebob =
  "https://en.meming.world/images/en/thumb/e/e0/Mocking_SpongeBob.jpg/300px-Mocking_SpongeBob.jpg";

export const spongebobCommand: Command = {
  name: "Spongebob",
  command: "sponbebob",
  aliases: ["retarded"],
  syntax: "<text>",
  examples: ["anything goes here"],
  isAdmin: false,
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

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setThumbnail(spongebob)
      .setDescription(letter);

    message.channel.send(embed);
  },
};
