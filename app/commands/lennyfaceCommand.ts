import { Command } from "discord.js";

import { lennyFacesUtils } from "~/utils/lennyFaceUtils";
import { mathUtils } from "~/utils/mathUtil";

export const lennyfaceCommand: Command = {
  name: "Lennyfaces",
  command: "lennyface",
  aliases: ["lenny"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random lenny face",

  async execute(message) {
    const randomPosition = mathUtils.getRandomArbitrary(
      0,
      lennyFacesUtils.length - 1,
    );

    message.channel.send(lennyFacesUtils[randomPosition]);
  },
};
