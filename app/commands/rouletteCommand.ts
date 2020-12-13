import { Command } from "discord.js";

import { inputUtils } from "~/utils/inputUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const ROULETTER_MIN_POT = 10;

export const rouletteCommand: Command = {
  name: "Roulette",
  command: "roulette",
  aliases: [],
  syntax: "<amount>",
  examples: ["50", "half", "60%"],
  isAdmin: false,
  description: "Gamble your money in roulette",

  async execute(message, args, { dataSources }) {
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    if (args.length === 0) {
      const embed = responseUtils.specifyGamblingAmount({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    const gambleAmount = await inputUtils.getAmountFromUserInput({
      input: args[0],
      currentPoints: user.points,
    });

    // INVALID INPUT
    if (!gambleAmount) {
      const embed = responseUtils.invalidCurrency({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    // VALUE TOO LOW
    if (user.points < ROULETTER_MIN_POT) {
      const embed = responseUtils.insufficientFunds({
        discordUser: message.author,
        user,
      });

      return message.channel.send(embed);
    }

    // NOT ENOUGH MONEY
    if (user.points < gambleAmount) {
      const embed = responseUtils.insufficientFunds({
        discordUser: message.author,
        user,
      });

      return message.channel.send(embed);
    }

    const hasWon = !!mathUtils.getRandomArbitrary(0, 1);

    const userWon = await dataSources.userDS.tryModifyCurrency({
      userDiscordId: message.author.id,
      modifyPoints: hasWon ? gambleAmount : gambleAmount * -1,
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
