import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class CatPictureCommand extends AbstractCommand {
  public async execute() {
    const catpicture = await this.services.animal.getCatPicture();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandCatPictureTitle"))
      .setImage(catpicture.file);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const catPictureCommand: Command = {
  emoji: "🐈",
  name: validateFormatMessageKey("commandCatPictureMetaName"),
  description: validateFormatMessageKey("commandCatPictureMetaDescription"),
  command: "cat",
  aliases: ["catpicture"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new CatPictureCommand(payload);
  },
};
