import { MessageEmbed, Command } from "discord.js";

import { Context } from "~/context";

const getDogPicture = async (context: Context) => {
  for (let i = 0; i < 5; i++) {
    const dogPicture = await context.services.animalService.getDogPicture();

    if (!dogPicture.url.includes(".mp4")) {
      return dogPicture;
    }
  }
};

export const dogPictureCommand: Command = {
  name: "Dog pictures!!",
  command: "dog",
  aliases: ["dogpicture"],
  description: "Get a random dog picture",

  async execute(message, _, context) {
    const dogPicture = await getDogPicture(context);

    if (!dogPicture) {
      return;
    }

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle("A wild dog appears!")
      .setImage(dogPicture.url)
      .setTimestamp();

    message.channel.send(embed);
  },
};
