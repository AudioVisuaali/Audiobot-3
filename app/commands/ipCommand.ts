import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { networkUtils } from "~/utils/networkUtils";
import { responseUtils } from "~/utils/responseUtils";

class IpCommand extends AbstractCommand {
  private async createFields(params: { ip: string }) {
    const ipData = await this.services.ip.getIpData({ ip: params.ip });

    return [
      {
        name: this.formatMessage("commandIpCity"),
        value: ipData.city,
        inline: true,
      },
      {
        name: this.formatMessage("commandIpRegion"),
        value: ipData.region,
        inline: true,
      },
      {
        name: this.formatMessage("commandIpCountry"),
        value: ipData.country,
        inline: true,
      },
      {
        name: this.formatMessage("commandIpLocation"),
        value: ipData.loc,
        inline: true,
      },
      {
        name: this.formatMessage("commandIpIP"),
        value: ipData.ip,
        inline: true,
      },
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
      .setTitle(this.formatMessage("commandIp", { address: this.args[0] }))
      .addFields(...fields);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const ipCommand: Command = {
  emoji: "📶",
  name: validateFormatMessageKey("commandIpMetaName"),
  description: validateFormatMessageKey("commandIpMetaDescription"),
  command: "ip",
  aliases: ["domain"],
  syntax: "<ip | domain>",
  examples: ["8.8.8.8"],
  isAdmin: false,

  getCommand(payload) {
    return new IpCommand(payload);
  },
};
