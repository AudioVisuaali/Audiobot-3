import { MessageEmbed, Command } from "discord.js";

export const genderCommand: Command = {
  name: "Gender",
  command: "gender",
  aliases: [],
  description: "Get persons Gender",

  async execute(message, args, { services }) {
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

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle(`Gender of ${genderResponse.name}`)
      .setDescription(
        `There's a ${genderResponse.probability * 100}% of **${
          genderResponse.name
        }** being a ${genderResponse.gender}!`,
      )
      .setFooter(`Count: ${genderResponse.count}`)
      .setTimestamp();

    return message.channel.send(embed);
  },
};
