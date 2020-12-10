import { Command, MessageEmbed } from "discord.js";

const btcLogoUrl =
  "http://icons.iconarchive.com/icons/froyoshark/enkel/256/Bitcoin-icon.png";

export const bitcoinCommand: Command = {
  name: "Bitcoin",
  command: "bitcoin",
  aliases: ["btc"],
  description: "Bitcoin's current value",

  async execute(message, _, { services }) {
    const bitcoinData = await services.currencyService.getBitcoinData();

    const { EUR, USD, GBP } = bitcoinData.bpi;

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle("Bitcoin is worth")
      .setThumbnail(btcLogoUrl)
      .addFields(
        {
          name: `${USD.code} $`,
          value: `$${USD.rate_float.toFixed(2)}`,
          inline: true,
        },
        {
          name: `${EUR.code} €`,
          value: `${EUR.rate_float.toFixed(2)}€`,
          inline: true,
        },
        {
          name: `${GBP.code} £`,
          value: `${GBP.rate_float.toFixed(2)}£`,
          inline: true,
        },
      )
      .setFooter(
        new Date(bitcoinData.time.updatedISO).toUTCString(),
        btcLogoUrl,
      )
      .setTimestamp();

    message.channel.send(embed);
  },
};
