import { Command } from "discord.js";

export const eightBallCommand: Command = {
  name: "8 Ball",
  command: "eightball",
  aliases: ["8ball"],
  description: "() ball responses)",
  execute(message, args, context) {
    const question = args.join(" ");

    if (question.length < 8) {
      return;
    }

    const randomIndex = context.utils.mathUtils.getRandomArbitrary(
      0,
      context.utils.eightBallUtils.length - 1,
    );

    message.channel.send(
      `:8ball: **| ${context.utils.eightBallUtils[randomIndex]}**`,
    );
  },
};
