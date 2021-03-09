import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { lennyFacesUtils } from "~/utils/lennyFaceUtils";
import { mathUtils } from "~/utils/mathUtil";

class LennyfaceCommand extends AbstractCommand {
  private getRandomLennyFace() {
    const facesMaxLength = lennyFacesUtils.length - 1;
    const randomPosition = mathUtils.getRandomArbitrary(0, facesMaxLength);

    return lennyFacesUtils[randomPosition];
  }

  public async execute() {
    await this.message.channel.send(this.getRandomLennyFace());
  }
}

export const lennyfaceCommand: Command = {
  emoji: "🙃",
  name: validateFormatMessageKey("commandLennyFaceMetaName"),
  description: validateFormatMessageKey("commandLennyFaceMetaDescription"),
  command: "lennyface",
  aliases: ["lenny"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new LennyfaceCommand(payload);
  },
};
