import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { lennyFacesUtils } from "~/utils/lennyFaceUtils";
import { mathUtils } from "~/utils/mathUtil";

class LennyfaceCommand extends AbstractCommand {
  async execute() {
    const randomPosition = mathUtils.getRandomArbitrary(
      0,
      lennyFacesUtils.length - 1,
    );

    await this.message.channel.send(lennyFacesUtils[randomPosition]);
  }
}

export const lennyfaceCommand: Command = {
  emoji: "🙃",
  name: "Lennyfaces",
  command: "lennyface",
  aliases: ["lenny"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random lenny face",

  getCommand(payload) {
    return new LennyfaceCommand(payload);
  },
};
