import { Command } from "discord.js";

export const lennyfaceCommand: Command = {
  name: "Lennyfaces",
  command: "lennyface",
  aliases: ["lenny"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random lenny face",

  async execute(message, _, { utils }) {
    const randomPosition = utils.math.getRandomArbitrary(
      0,
      utils.lennyFaces.length - 1,
    );

    message.channel.send(utils.lennyFaces[randomPosition]);
  },
};
