import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class CatPictureCommand extends AbstractCommand {
  async execute() {
    const catpicture = await this.services.animal.getCatPicture();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandCatPictureTitle"))
      .setImage(catpicture.file);

    await this.message.channel.send(embed);
  }
}

export const catPictureCommand: Command = {
  emoji: "🐈",
  name: "Cat Picture",
  command: "cat",
  aliases: ["catpicture"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random cat picture",

  getCommand(payload) {
    return new CatPictureCommand(payload);
  },
};
