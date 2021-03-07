import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { networkUtils } from "~/utils/networkUtils";
import { responseUtils } from "~/utils/responseUtils";

class IpCommand extends AbstractCommand {
  async execute() {
    const isIP = networkUtils.validateIPaddress(this.args[0]);

    const ip = isIP
      ? this.args[0]
      : await networkUtils.getIPOfDomain(this.args[0]);

    const ipData = await this.services.ip.getIpData({ ip });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`🌐 Information for ${isIP ? ip : this.args[0]}`)
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

    await this.message.channel.send(embed);
  }
}

export const ipCommand: Command = {
  emoji: "📶",
  name: "IP info",
  command: "ip",
  aliases: ["domain"],
  syntax: "<ip | domain>",
  examples: ["8.8.8.8"],
  isAdmin: false,
  description: "Ip related information",

  getCommand(payload) {
    return new IpCommand(payload);
  },
};
