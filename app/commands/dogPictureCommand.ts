import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class DogPictureCommand extends AbstractCommand {
  async getDogPicture() {
    for (let i = 0; i < 5; i++) {
      const dogPicture = await this.services.animal.getDogPicture();

      if (!dogPicture.url.includes(".mp4")) {
        return dogPicture;
      }
    }
  }

  async execute() {
    const dogPicture = await this.getDogPicture();

    if (!dogPicture) {
      return;
    }

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandDogPictureTitle"))
      .setImage(dogPicture.url);

    await this.message.channel.send(embed);
  }
}

export const dogPictureCommand: Command = {
  emoji: "🐕",
  name: "Dog Picture",
  command: "dog",
  aliases: ["dogpicture"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random dog picture",

  getCommand(payload) {
    return new DogPictureCommand(payload);
  },
};
