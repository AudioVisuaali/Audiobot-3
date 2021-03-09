import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { BPICurrency, BPICurrencyType } from "~/services/currencyService";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

const btcColor = "#f99e1a";
const btcLogoUrl =
  "http://icons.iconarchive.com/icons/froyoshark/enkel/256/Bitcoin-icon.png";

class BitcoinCommand extends AbstractCommand {
  public async execute() {
    const currentPrices = await this.getCurrentPrices();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setColor(btcColor)
      .setTitle(this.formatMessage("commandBitcoinTitle"))
      .setThumbnail(btcLogoUrl)
      .addFields(...currentPrices);

    await this.message.channel.send(embed);
  }

  private async getCurrentPrices() {
    const bitcoinData = await this.services.currency.getBitcoinData();

    return Object.values(bitcoinData.bpi).map((bpi) => ({
      name: `${bpi.code}`,
      value: this.getPrice(bpi),
      inline: true,
    }));
  }

  private getPrice(bpi: BPICurrency) {
    const rate = bpi.rate_float.toFixed(2);

    switch (bpi.code) {
      case BPICurrencyType.USD:
        return `$${rate}`;

      case BPICurrencyType.EUR:
        return `${rate}€`;

      case BPICurrencyType.GBP:
        return `${rate}£`;

      default:
        return rate;
    }
  }
}

export const bitcoinCommand: Command = {
  emoji: "🪙",
  name: validateFormatMessageKey("commandBitcoinMetaName"),
  command: "bitcoin",
  aliases: ["btc"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: validateFormatMessageKey("commandBitcoinMetaDescription"),

  getCommand(payload) {
    return new BitcoinCommand(payload);
  },
};
