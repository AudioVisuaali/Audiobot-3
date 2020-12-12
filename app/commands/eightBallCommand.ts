import { Command } from "discord.js";

export const eightBallCommand: Command = {
  name: "8 Ball",
  command: "eightball",
  aliases: ["8ball"],
  description: "() ball responses)",
  execute(message, args, { utils }) {
    const question = args.join(" ");

    if (question.length < 8) {
      return;
    }

    const randomIndex = utils.math.getRandomArbitrary(
      0,
      utils.eightBall.length - 1,
    );

    message.channel.send(`:8ball: **| ${utils.eightBall[randomIndex]}**`);
  },
};
