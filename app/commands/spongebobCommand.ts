import { Command } from "discord.js";

const spongebob =
  "https://en.meming.world/images/en/thumb/e/e0/Mocking_SpongeBob.jpg/300px-Mocking_SpongeBob.jpg";

export const spongebobCommand: Command = {
  name: "Spongebob!",
  command: "sponbebob",
  aliases: ["retarded"],
  description: "Spongebob styled text",

  async execute(message, args, { utils }) {
    const letter = args
      .join(" ")
      .split("")
      .map((character, index) =>
        index % 2 === 0
          ? character.toLocaleLowerCase()
          : character.toLocaleUpperCase(),
      )
      .join("");

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setThumbnail(spongebob)
      .setDescription(letter);

    message.channel.send(embed);
  },
};
