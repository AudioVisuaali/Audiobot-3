import { MessageEmbed, Command } from "discord.js";

export const ipCommand: Command = {
  name: "IP info",
  command: "ip",
  aliases: [],
  description: "Ip related information",

  async execute(message, args, context) {
    const ipData = await context.services.ipService.getIpData({ ip: args[0] });

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
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
      )
      .setTimestamp();

    message.channel.send(embed);
  },
};
