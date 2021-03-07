import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
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

      return this.message.channel.send(embed);
    }

    if (this.args[0].length > 10) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandStockTitle"))
        .setDescription(
          this.formatMessage("commandStockDescriptionSymbolTooLong"),
        );

      return this.message.channel.send(embed);
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

      return this.message.channel.send(embed);
    }

    const { primaryData, keyStats } = stock;
    const { lastSalePrice, netChange, percentageChange } = primaryData;
    const { PreviousClose, Volume, MarketCap } = keyStats;

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`${stock.symbol} - ${lastSalePrice}`)
      .addField(
        this.formatMessage("commandStockFieldPriceChange"),
        `${netChange} (${percentageChange})`,
        true,
      )
      .addField(
        this.formatMessage("commandStockFieldPreviousClose"),
        PreviousClose.value,
        true,
      )
      .addField(
        this.formatMessage("commandStockFieldCompany"),
        stock.companyName,
        true,
      )
      .addField(
        this.formatMessage("commandStockFieldVolume"),
        Volume.value,
        true,
      )
      .addField(
        this.formatMessage("commandStockFieldMarketCap"),
        MarketCap.value,
        true,
      );

    await this.message.channel.send(embed);
  }
}

export const stockCommand: Command = {
  emoji: "📈",
  name: "Stock",
  command: "stock",
  aliases: ["retarded"],
  syntax: "<ticker symbol>",
  examples: ["TSLA", "FB"],
  isAdmin: false,
  description: "Get stock price by ticker symbol",

  getCommand(payload) {
    return new StockCommand(payload);
  },
};
