import { Command } from "~/commands/commands";
import { Context } from "~/context";
import { responseUtils } from "~/utils/responseUtils";

const getDogPicture = async ({ services }: Context) => {
  for (let i = 0; i < 5; i++) {
    const dogPicture = await services.animal.getDogPicture();

    if (!dogPicture.url.includes(".mp4")) {
      return dogPicture;
    }
  }
};

export const dogPictureCommand: Command = {
  emoji: "🐕",
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

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle("A wild dog appears!")
      .setImage(dogPicture.url);

    await message.channel.send(embed);
  },
};
