import { Command } from "discord.js";

import { responseUtils } from "~/utils/responseUtils";

export const ipCommand: Command = {
  name: "IP info",
  command: "ip",
  aliases: [],
  syntax: "<ip>",
  examples: ["8.8.8.8"],
  isAdmin: false,
  description: "Ip related information",

  async execute(message, args, { services }) {
    const ipData = await services.ip.getIpData({ ip: args[0] });

    const embed = responseUtils
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
