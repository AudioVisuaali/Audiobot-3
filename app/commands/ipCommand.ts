import { Command } from "discord.js";

export const ipCommand: Command = {
  name: "IP info",
  command: "ip",
  aliases: [],
  description: "Ip related information",

  async execute(message, args, { services, utils }) {
    const ipData = await services.ip.getIpData({ ip: args[0] });

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle(`Information for ${ipData.ip}`)
      .addFields(
        {
          name: "City",
          value: ipData.city,
          inline: true,
        },
        {
          name: "Region",
          value: ipData.region,
          inline: true,
        },
        {
          name: "Country",
          value: ipData.country,
          inline: true,
        },
        {
          name: "Location",
          value: ipData.loc,
          inline: true,
        },
      );

    message.channel.send(embed);
  },
};
