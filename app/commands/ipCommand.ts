import { Command } from "~/commands/commands";
import { networkUtils } from "~/utils/networkUtils";
import { responseUtils } from "~/utils/responseUtils";

export const ipCommand: Command = {
  name: "IP info",
  command: "ip",
  aliases: ["domain"],
  syntax: "<ip | domain>",
  examples: ["8.8.8.8"],
  isAdmin: false,
  description: "Ip related information",

  async execute(message, args, { services }) {
    const isIP = networkUtils.validateIPaddress(args[0]);

    const ip = isIP ? args[0] : await networkUtils.getIPOfDomain(args[0]);

    const ipData = await services.ip.getIpData({ ip });

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`Information for ${isIP ? ip : args[0]}`)
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
        {
          name: "IP",
          value: ipData.ip,
          inline: true,
        },
      );

    message.channel.send(embed);
  },
};
