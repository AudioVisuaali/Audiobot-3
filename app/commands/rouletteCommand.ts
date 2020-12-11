import { MessageEmbed, Command } from "discord.js";

export const ROULETTER_MIN_POT = 10;

export const rouletteCommand: Command = {
  name: "Roulette",
  command: "roulette",
  aliases: [],
  description: "Gamble your money in roulette",

  async execute(message, args, context) {
    const user = await context.dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    // MIN 10 POINTS
    if (args.length === 0) {
      const embed = new MessageEmbed()
        .setColor("#f99e1a")
        .setTitle("Invalid currency")
        .setDescription("You need to specify the amount you want to roulette")
        .setTimestamp();

      return message.channel.send(embed);
    }

    // INVALID INPUT
    const gambleAmount = context.utils.mathUtils.parseStringToNumber(args[0]);
    if (!gambleAmount) {
      const embed = new MessageEmbed()
        .setColor("#f99e1a")
        .setTitle("Invalid currency")
        .setDescription("The amount you gave is not valid")
        .setTimestamp();

      return message.channel.send(embed);
    }

    // VALUE TOO LOW
    if (user.points < ROULETTER_MIN_POT) {
      const embed = new MessageEmbed()
        .setColor("#f99e1a")
        .setTitle("Insufficient funds")
        .setDescription(
          `You need atleast **${ROULETTER_MIN_POT}** points to roulette. You currently have **${user.points}** points.`,
        )
        .setTimestamp();

      return message.channel.send(embed);
    }

    // NOT ENOUGH MONEY
    if (user.points < gambleAmount) {
      const embed = new MessageEmbed()
        .setColor("#f99e1a")
        .setTitle("Insufficient funds")
        .setDescription(
          `You are gambling with more currency than you can afford. You currently have ${user.points} points`,
        )
        .setTimestamp();

      return message.channel.send(embed);
    }

    const hasWon = !!context.utils.mathUtils.getRandomArbitrary(0, 1);

    const userWon = await context.dataSources.userDS.tryModifyMemes({
      userDiscordId: message.author.id,
      modifyMemeCount: hasWon ? gambleAmount : gambleAmount * -1,
    });

    if (hasWon) {
      const embed = new MessageEmbed()
        .setColor("#f99e1a")
        .setTitle(`+ ${gambleAmount} points`)
        .setDescription(
          `You have won **${gambleAmount}** points, you now have **${userWon.points}** points`,
        )
        .setTimestamp();

      return message.channel.send(embed);
    }

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle(`- ${gambleAmount} points`)
      .setDescription(
        `You have lost **${gambleAmount}** points, you now have **${userWon.points}** points`,
      )
      .setTimestamp();

    message.channel.send(embed);
  },
};
