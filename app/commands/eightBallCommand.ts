import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { eightBallUtils } from "~/utils/eightBallUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

class EightBallCommand extends AbstractCommand {
  getQuestion() {
    return this.args.join(" ");
  }

  async execute() {
    if (this.getQuestion().length < 8) {
      return;
    }

    const randomIndex = mathUtils.getRandomArbitrary(
      0,
      eightBallUtils.length - 1,
    );

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(`🎱 ${eightBallUtils[randomIndex]}`);

    await this.message.channel.send(embed);
  }
}

export const eightBallCommand: Command = {
  emoji: "🎱",
  name: "8 Ball",
  command: "eightball",
  aliases: ["8ball"],
  syntax: "<question>",
  examples: ["Am I going to succeed"],
  isAdmin: false,
  description: "8 ball responses your question",

  getCommand(payload) {
    return new EightBallCommand(payload);
  },
};
