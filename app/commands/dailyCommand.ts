import { MessageEmbed, Command } from "discord.js";

const getDailyFix = (number: number) => {
  if (number < 1) {
    return {
      multiplier: 4,
      explainer: "miscalculation happened you gained fourfold to normal",
    };
  }

  if (number < 5) {
    return {
      multiplier: 2,
      explainer: "miscalculation happened you gained twofold to normal",
    };
  }

  return {
    multiplier: 1,
    explainer: null,
  };
};

export const dailyCommand: Command = {
  name: "Daily",
  command: "daily",
  aliases: ["kela"],
  description: "Get your daily fix",

  async execute(message, args, context) {
    if (args.length !== 0) {
      return message.channel.send("Invalid parameters");
    }

    const user = await context.dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    if (user.dailyRetrieved) {
      // 24H Logic here
    }

    const dailyAmountBase = context.utils.mathUtils.getRandomArbitrary(
      380,
      420,
    );
    const luckinessProbability = context.utils.mathUtils.getRandomArbitrary(
      0,
      99,
    );

    const { multiplier, explainer } = getDailyFix(luckinessProbability);

    const dailyAmount = dailyAmountBase * multiplier;
    const userUpdated = await context.dataSources.userDS.tryAddMemes({
      userDiscordId: message.author.id,
      addMemesCount: dailyAmount,
    });

    const extra = explainer ? `, __${explainer}__` : "";

    const embed = new MessageEmbed()
      .setColor("#f99e1a")
      .setTitle(`+ ${dailyAmount} memes`)
      .setDescription(`You redeemed your daily memes${extra}!`)
      .addField("New total", `${userUpdated.points} memes`, true)
      .setTimestamp();

    return message.channel.send(embed);
  },
};
