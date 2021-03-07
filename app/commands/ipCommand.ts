import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { networkUtils } from "~/utils/networkUtils";
import { responseUtils } from "~/utils/responseUtils";

class IpCommand extends AbstractCommand {
  private async createFields(params: { ip: string }) {
    const ipData = await this.services.ip.getIpData({ ip: params.ip });

    return [
      { name: "City", value: ipData.city, inline: true },
      { name: "Region", value: ipData.region, inline: true },
      { name: "Country", value: ipData.country, inline: true },
      { name: "Location", value: ipData.loc, inline: true },
      { name: "IP", value: ipData.ip, inline: true },
    ];
  }

  private async getIP() {
    const isIP = networkUtils.validateIPaddress(this.args[0]);

    if (isIP) {
      return this.args[0];
    }

    return await networkUtils.getIPOfDomain(this.args[0]);
  }

  public async execute() {
    const ip = await this.getIP();

    const fields = await this.createFields({ ip });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`🌐 Information for ${this.args[0]}`)
      .addFields(...fields);

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
