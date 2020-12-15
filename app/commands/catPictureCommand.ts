import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const catPictureCommand: Command = {
  emoji: "🐈",
  name: "Cat Picture",
  command: "cat",
  aliases: ["catpicture"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random cat picture",

  async execute(message, _, { services }) {
    const catpicture = await services.animal.getCatPicture();

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle("🐈 A wild cat appears!")
      .setImage(catpicture.file);

    message.channel.send(embed);
  },
};
