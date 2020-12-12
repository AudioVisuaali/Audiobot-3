import { Command } from "discord.js";

import { Context } from "~/context";

const getDogPicture = async ({ services }: Context) => {
  for (let i = 0; i < 5; i++) {
    const dogPicture = await services.animal.getDogPicture();

    if (!dogPicture.url.includes(".mp4")) {
      return dogPicture;
    }
  }
};

export const dogPictureCommand: Command = {
  name: "Dog Picture",
  command: "dog",
  aliases: ["dogpicture"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random dog picture",

  async execute(message, _, context) {
    const dogPicture = await getDogPicture(context);

    if (!dogPicture) {
      return;
    }

    const embed = context.utils.response
      .positive({ discordUser: message.author })
      .setTitle("A wild dog appears!")
      .setImage(dogPicture.url);

    message.channel.send(embed);
  },
};
