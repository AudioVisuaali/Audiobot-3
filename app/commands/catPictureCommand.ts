import { MessageEmbed, Command } from "discord.js";

export const catPictureCommand: Command = {
  name: "Cat pictures!!",
  command: "cat",
  aliases: ["catpicture"],
  description: "Get a random cat picture",

  async execute(message, _, { services }) {
    const catpicture = await services.animal.getCatPicture();

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle("A wild cat appears!")
      .setImage(catpicture.file)
      .setTimestamp();

    message.channel.send(embed);
  },
};
