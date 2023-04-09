import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class StockCommand extends AbstractCommand {
  public async execute() {
    if (!this.args.length) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandStockTitle"))
        .setDescription(
          this.formatMessage("commandStockDescriptionInvalidSymbol"),
        );

      return this.message.channel.send({ embeds: [embed] });
    }

    if (this.args[0].length > 10) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandStockTitle"))
        .setDescription(
          this.formatMessage("commandStockDescriptionSymbolTooLong"),
        );

      return this.message.channel.send({ embeds: [embed] });
    }

    const stock = await this.services.stats.getStock({
      tickerSymbol: this.args[0],
    });

    if (!stock) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandStockTitle"))
        .setDescription(
          this.formatMessage("commandStockDescriptionNotFound", {
            tickerSymbol: this.args[0],
          }),
        );

      return this.message.channel.send({ embeds: [embed] });
    }

    const { primaryData, keyStats } = stock;
    const { lastSalePrice, netChange, percentageChange } = primaryData;
    const { PreviousClose, Volume, MarketCap } = keyStats;

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`${stock.symbol} - ${lastSalePrice}`)
      .addFields([
        {
          name: this.formatMessage("commandStockFieldPriceChange"),
          value: `${netChange} (${percentageChange})`,
          inline: true,
        },
        {
          name: this.formatMessage("commandStockFieldPreviousClose"),
          value: PreviousClose.value,
          inline: true,
        },
        {
          name: this.formatMessage("commandStockFieldCompany"),
          value: stock.companyName,
          inline: true,
        },
        {
          name: this.formatMessage("commandStockFieldVolume"),
          value: Volume.value,
          inline: true,
        },
        {
          name: this.formatMessage("commandStockFieldMarketCap"),
          value: MarketCap.value,
          inline: true,
        },
      ]);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const stockCommand: Command = {
  emoji: "📈",
  name: validateFormatMessageKey("commandStockMetaName"),
  description: validateFormatMessageKey("commandStockMetaDescription"),
  command: "stock",
  aliases: ["retarded"],
  syntax: "<ticker symbol>",
  examples: ["TSLA", "FB"],
  isAdmin: false,

  getCommand(payload) {
    return new StockCommand(payload);
  },
};
