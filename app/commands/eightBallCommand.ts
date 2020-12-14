import { Command } from "~/commands/commands";
import { eightBallUtils } from "~/utils/eightBallUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const eightBallCommand: Command = {
  name: "8 Ball",
  command: "eightball",
  aliases: ["8ball"],
  syntax: "<question>",
  examples: ["Am I going to succeed"],
  isAdmin: false,
  description: "8 ball responses your question",

  async execute(message, args) {
    const question = args.join(" ");

    if (question.length < 8) {
      return;
    }

    const randomIndex = mathUtils.getRandomArbitrary(
      0,
      eightBallUtils.length - 1,
    );

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setDescription(`:8ball: ${eightBallUtils[randomIndex]}`);

    message.channel.send(embed);
  },
};
