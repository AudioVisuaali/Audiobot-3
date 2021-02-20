import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const stockCommand: Command = {
  emoji: "📈",
  name: "Stock",
  command: "stock",
  aliases: ["retarded"],
  syntax: "<ticker symbol>",
  examples: ["TSLA", "FB"],
  isAdmin: false,
  description: "Get stock price by ticker symbol",

  async execute(message, args, { services }) {
    if (!args.length) {
      const embed = responseUtils
        .negative({ discordUser: message.author })
        .setTitle("📈 Stock")
        .setDescription("You need to provide a ticker symbol");

      return message.channel.send(embed);
    }

    if (args[0].length > 10) {
      const embed = responseUtils
        .negative({ discordUser: message.author })
        .setTitle("📈 Stock")
        .setDescription("Ticker symbol too long");

      return message.channel.send(embed);
    }

    const stock = await services.stats.getStock({ tickerSymbol: args[0] });

    if (!stock) {
      const embed = responseUtils
        .negative({ discordUser: message.author })
        .setTitle("📈 Stock")
        .setDescription(`Stock not found with ticker symbol ** ${args[0]}**`);

      return message.channel.send(embed);
    }

    const { primaryData, keyStats } = stock;
    const { lastSalePrice, netChange, percentageChange } = primaryData;
    const { PreviousClose, Volume, MarketCap } = keyStats;

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`${stock.symbol} - ${lastSalePrice}`)
      .addField("Price change", `${netChange} (${percentageChange})`, true)
      .addField("Previous close", PreviousClose.value, true)
      .addField("Company", stock.companyName, true)
      .addField("Volume", Volume.value, true)
      .addField("Market Cap", MarketCap.value, true);

    await message.channel.send(embed);
  },
};
