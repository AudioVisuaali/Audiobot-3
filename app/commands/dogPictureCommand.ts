import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class DogPictureCommand extends AbstractCommand {
  private async getDogPicture() {
    for (let i = 0; i < 5; i++) {
      const dogPicture = await this.services.animal.getDogPicture();

      if (!dogPicture.url.includes(".mp4")) {
        return dogPicture;
      }
    }
  }

  public async execute() {
    const dogPicture = await this.getDogPicture();

    if (!dogPicture) {
      return;
    }

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandDogPictureTitle"))
      .setImage(dogPicture.url);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const dogPictureCommand: Command = {
  emoji: "🐕",
  name: validateFormatMessageKey("commandDogPictureMetaName"),
  description: validateFormatMessageKey("commandDogPictureMetaDescription"),
  command: "dog",
  aliases: ["dogpicture"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new DogPictureCommand(payload);
  },
};
