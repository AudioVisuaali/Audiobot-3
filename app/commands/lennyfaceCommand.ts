import { Command } from "discord.js";

export const lennyfaceCommand: Command = {
  name: "Lennyfaces",
  command: "lennyface",
  aliases: ["lenny"],
  description: "Get a random lenny face",

  async execute(message, _, context) {
    const randomPosition = context.utils.mathUtils.getRandomArbitrary(
      0,
      context.utils.lennyFacesUtils.length - 1,
    );

    message.channel.send(context.utils.lennyFacesUtils[randomPosition]);
  },
};
