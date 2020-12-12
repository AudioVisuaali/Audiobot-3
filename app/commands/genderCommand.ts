import { Command } from "discord.js";

export const genderCommand: Command = {
  name: "Gender",
  command: "gender",
  aliases: [],
  syntax: "<name>",
  examples: ["Alex", "Emma"],
  isAdmin: false,
  description: "Get persons Gender",

  async execute(message, args, { services, utils }) {
    if (args.length === 0) {
      return;
    }

    const genderResponse = await services.stats.getGenderOfName({
      name: args[0],
    });

    if (!genderResponse.gender) {
      return message.channel.send(
        `No data was found for ${genderResponse.name}!`,
      );
    }

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle(`Gender of ${genderResponse.name}`)
      .setDescription(
        `There's a ${genderResponse.probability * 100}% of **${
          genderResponse.name
        }** being a ${genderResponse.gender}!`,
      );

    return message.channel.send(embed);
  },
};
