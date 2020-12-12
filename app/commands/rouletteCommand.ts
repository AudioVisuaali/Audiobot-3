import { Command } from "discord.js";

import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const ROULETTER_MIN_POT = 10;

export const rouletteCommand: Command = {
  name: "Roulette",
  command: "roulette",
  aliases: [],
  syntax: "<amount>",
  examples: ["50"],
  isAdmin: false,
  description: "Gamble your money in roulette",

  async execute(message, args, { dataSources }) {
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    // MIN 10 POINTS
    if (args.length === 0) {
      const embed = responseUtils
        .invalidCurrency({ discordUser: message.author })
        .setDescription("You need to specify the amount you want to roulette");

      return message.channel.send(embed);
    }

    // INVALID INPUT
    const gambleAmount = mathUtils.parseStringToNumber(args[0]);
    if (!gambleAmount) {
      const embed = responseUtils
        .invalidCurrency({ discordUser: message.author })
        .setDescription("The amount you gave is not valid");

      return message.channel.send(embed);
    }

    // VALUE TOO LOW
    if (user.points < ROULETTER_MIN_POT) {
      const embed = responseUtils
        .insufficientFunds({ discordUser: message.author })
        .setDescription(
          `You need atleast **${ROULETTER_MIN_POT}** points to roulette. You currently have **${user.points}** points.`,
        );

      return message.channel.send(embed);
    }

    // NOT ENOUGH MONEY
    if (user.points < gambleAmount) {
      const embed = responseUtils
        .insufficientFunds({ discordUser: message.author })
        .setTitle("Insufficient funds")
        .setDescription(
          `You are gambling with more currency than you can afford. You currently have ${user.points} points`,
        );

      return message.channel.send(embed);
    }

    const hasWon = !!mathUtils.getRandomArbitrary(0, 1);

    const userWon = await dataSources.userDS.tryModifyMemes({
      userDiscordId: message.author.id,
      modifyMemeCount: hasWon ? gambleAmount : gambleAmount * -1,
    });

    if (hasWon) {
      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setTitle(`+ ${gambleAmount} points`)
        .setDescription(
          `You have won **${gambleAmount}** points, you now have **${userWon.points}** points`,
        );

      return message.channel.send(embed);
    }

    const embed = responseUtils
      .negative({ discordUser: message.author })
      .setTitle(`- ${gambleAmount} points`)
      .setDescription(
        `You have lost **${gambleAmount}** points, you now have **${userWon.points}** points`,
      );

    message.channel.send(embed);
  },
};
