import { Command } from "discord.js";

export const catPictureCommand: Command = {
  name: "Cat pictures!!",
  command: "cat",
  aliases: ["catpicture"],
  description: "Get a random cat picture",

  async execute(message, _, { services, utils }) {
    const catpicture = await services.animal.getCatPicture();

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle("A wild cat appears!")
      .setImage(catpicture.file);

    message.channel.send(embed);
  },
};
