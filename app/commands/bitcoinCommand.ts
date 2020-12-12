import { Command } from "discord.js";

import { BPICurrency, BPICurrencyType } from "~/services/currencyService";

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
  name: "Bitcoin",
  command: "bitcoin",
  aliases: ["btc"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Bitcoin's current value",

  async execute(message, _, { services, utils }) {
    const bitcoinData = await services.currency.getBitcoinData();

    const bpis = Object.values(bitcoinData.bpi).map((bpi) => ({
      name: `${bpi.code}`,
      value: getPrice(bpi),
      inline: true,
    }));

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setColor("#f99e1a")
      .setTitle("Bitcoin is worth")
      .setThumbnail(btcLogoUrl)
      .addFields(...bpis);

    message.channel.send(embed);
  },
};
