import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const genderCommand: Command = {
  emoji: "⚧️",
  name: "Gender",
  command: "gender",
  aliases: [],
  syntax: "<name>",
  examples: ["Alex", "Emma"],
  isAdmin: false,
  description: "Get persons Gender",

  async execute(message, args, { services }) {
    if (args.length === 0) {
      return;
    }

    const genderResponse = await services.stats.getGenderOfName({
      name: args[0],
    });

    if (!genderResponse.gender) {
      return await message.channel.send(
        `No data was found for ${genderResponse.name}!`,
      );
    }

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`🍆 Gender of ${genderResponse.name}`)
      .setDescription(
        `There's a ${genderResponse.probability * 100}% of **${
          genderResponse.name
        }** being a ${genderResponse.gender}!`,
      );

    return await message.channel.send(embed);
  },
};
