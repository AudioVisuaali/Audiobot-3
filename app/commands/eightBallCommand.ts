import { Command } from "discord.js";

export const eightBallCommand: Command = {
  name: "8 Ball",
  command: "eightball",
  aliases: ["8ball"],
  syntax: "<question>",
  examples: ["Am I going to succeed"],
  isAdmin: false,
  description: "8 ball responses your question",

  execute(message, args, { utils }) {
    const question = args.join(" ");

    if (question.length < 8) {
      return;
    }

    const randomIndex = utils.math.getRandomArbitrary(
      0,
      utils.eightBall.length - 1,
    );

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setDescription(`:8ball: ${utils.eightBall[randomIndex]}`);

    message.channel.send(embed);
  },
};
