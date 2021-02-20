import { Command } from "~/commands/commands";
import { fingerporiUtils } from "~/utils/fingerporiUtils";
import { responseUtils } from "~/utils/responseUtils";

export const fingerporiCommand: Command = {
  emoji: "🤔",
  name: "Fingerpori",
  command: "fingerpori",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random fingerpori",

  async execute(message) {
    const fingerporiURL = fingerporiUtils.getRandomFingerPori();

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setImage(fingerporiURL);

    return await message.channel.send(embed);
  },
};
