import { MessageEmbed, Command } from "discord.js";

const fruits = {
  honeyPot: {
    value: "honeyPot",
    emoji: ":honey_pot:",
    multiplier: 10,
  },
  eggplant: {
    value: "eggplant",
    emoji: ":eggplant:",
    multiplier: 7.5,
  },
  banana: {
    value: "banana",
    emoji: ":banana:",
    multiplier: 6.5,
  },
  peach: {
    value: "peach",
    emoji: ":peach:",
    multiplier: 5.5,
  },
  cherries: {
    value: "cherries",
    emoji: ":cherries:",
    multiplier: 4.5,
  },
  apple: {
    value: "apple",
    emoji: ":apple:",
    multiplier: 3.5,
  },
};

const extras = {
  two: {
    count: 2,
    multiplier: 5,
  },
  three: {
    count: 3,
    multiplier: 15,
  },
};

export const slotsCommand: Command = {
  name: "Slots",
  command: "slotmachine",
  aliases: ["slots"],
  description: "Gamble your money with slots",

  async execute(message, args, { utils }) {
    if (args.length === 0) {
      const valuesMessage = Object.values(fruits)
        .map((fruit) => `${fruit.emoji} ${fruit.multiplier}x`)
        .join("\n");

      const extrasMessage = Object.values(extras)
        .map((extra) => `${extra.count} straight ${extra.multiplier}x`)
        .join("\n");

      const embed = new MessageEmbed()
        .setColor("#f99e1a")
        .addField("Slots machine multipliers", valuesMessage)
        .addField("Slots machine extras", extrasMessage)
        .setTimestamp();

      message.channel.send(embed);
    }

    const gamblingAmount = await utils.math.parseStringToNumber(args[0]);

    if (!gamblingAmount) {
      const embed = new MessageEmbed()
        .setColor("#f99e1a")
        .setTitle("Invalid currency")
        .setDescription("The amount you gave is not valid")
        .setTimestamp();

      return message.channel.send(embed);
    }
  },
};