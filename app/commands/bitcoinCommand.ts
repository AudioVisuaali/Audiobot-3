import { Command } from "~/commands/commands";
import { BPICurrency, BPICurrencyType } from "~/services/currencyService";
import { responseUtils } from "~/utils/responseUtils";

const btcLogoUrl =
  "http://icons.iconarchive.com/icons/froyoshark/enkel/256/Bitcoin-icon.png";

const getPrice = (bpi: BPICurrency) => {
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
};

export const bitcoinCommand: Command = {
  emoji: "🪙",
  name: "Bitcoin",
  command: "bitcoin",
  aliases: ["btc"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Bitcoin's current value",

  async execute(message, _, { services }) {
    const bitcoinData = await services.currency.getBitcoinData();

    const bpis = Object.values(bitcoinData.bpi).map((bpi) => ({
      name: `${bpi.code}`,
      value: getPrice(bpi),
      inline: true,
    }));

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setColor("#f99e1a")
      .setTitle("Bitcoin is worth")
      .setThumbnail(btcLogoUrl)
      .addFields(...bpis);

    await message.channel.send(embed);
  },
};
