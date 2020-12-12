import { Command } from "discord.js";

export const ROULETTER_MIN_POT = 10;

export const rouletteCommand: Command = {
  name: "Roulette",
  command: "roulette",
  aliases: [],
  description: "Gamble your money in roulette",

  async execute(message, args, { utils, dataSources }) {
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    // MIN 10 POINTS
    if (args.length === 0) {
      const embed = utils.response
        .invalidCurrency()
        .setDescription("You need to specify the amount you want to roulette");

      return message.channel.send(embed);
    }

    // INVALID INPUT
    const gambleAmount = utils.math.parseStringToNumber(args[0]);
    if (!gambleAmount) {
      const embed = utils.response
        .invalidCurrency()
        .setDescription("The amount you gave is not valid");

      return message.channel.send(embed);
    }

    // VALUE TOO LOW
    if (user.points < ROULETTER_MIN_POT) {
      const embed = utils.response
        .insufficientFunds()
        .setDescription(
          `You need atleast **${ROULETTER_MIN_POT}** points to roulette. You currently have **${user.points}** points.`,
        );

      return message.channel.send(embed);
    }

    // NOT ENOUGH MONEY
    if (user.points < gambleAmount) {
      const embed = utils.response
        .insufficientFunds()
        .setTitle("Insufficient funds")
        .setDescription(
          `You are gambling with more currency than you can afford. You currently have ${user.points} points`,
        );

      return message.channel.send(embed);
    }

    const hasWon = !!utils.math.getRandomArbitrary(0, 1);

    const userWon = await dataSources.userDS.tryModifyMemes({
      userDiscordId: message.author.id,
      modifyMemeCount: hasWon ? gambleAmount : gambleAmount * -1,
    });

    if (hasWon) {
      const embed = utils.response
        .positiveResponse()
        .setTitle(`+ ${gambleAmount} points`)
        .setDescription(
          `You have won **${gambleAmount}** points, you now have **${userWon.points}** points`,
        );

      return message.channel.send(embed);
    }

    const embed = utils.response
      .negativeResponse()
      .setTitle(`- ${gambleAmount} points`)
      .setDescription(
        `You have lost **${gambleAmount}** points, you now have **${userWon.points}** points`,
      );

    message.channel.send(embed);
  },
};
