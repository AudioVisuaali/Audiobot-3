import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { eightBallUtils } from "~/utils/eightBallUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

class EightBallCommand extends AbstractCommand {
  private getQuestion() {
    return this.args.join(" ");
  }

  private isValidQuestion() {
    return this.getQuestion().length > 8;
  }

  private getRandomEightBall() {
    const randomIndex = mathUtils.getRandomArbitrary(
      0,
      eightBallUtils.length - 1,
    );

    return eightBallUtils[randomIndex];
  }

  public async execute() {
    if (this.isValidQuestion()) {
      return;
    }

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(`🎱 ${this.getRandomEightBall()}`);

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
