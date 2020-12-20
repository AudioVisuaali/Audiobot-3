import { DateTime } from "luxon";

import { Command } from "~/commands/commands";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

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
  emoji: "📅",
  name: "Daily",
  command: "daily",
  aliases: ["kela"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get your daily fix",

  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    if (args.length !== 0) {
      return message.channel.send("Invalid parameters");
    }

    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
      guildDiscordId: message.guild.id,
    });

    if (user.dailyRetrieved) {
      const dailyAvailableTime = user.dailyRetrieved.plus({ day: 1 });
      const currentTime = DateTime.utc();

      if (dailyAvailableTime.valueOf() > currentTime.valueOf()) {
        const embed = responseUtils.cooldown({
          discordUser: message.author,
          availableAt: dailyAvailableTime,
        });

        return message.channel.send(embed);
      }
    }

    const dailyAmountBase = mathUtils.getRandomArbitrary(380, 420);
    const luckinessProbability = mathUtils.getRandomArbitrary(0, 99);

    const { multiplier, explainer } = getDailyFix(luckinessProbability);

    const dailyAmount = dailyAmountBase * multiplier;
    const userUpdated = await dataSources.userDS.tryModifyCurrency({
      guildDiscordId: message.guild.id,
      userDiscordId: message.author.id,
      modifyPoints: dailyAmount,
      updateDailyClaimed: true,
    });

    const extra = explainer ? `, __${explainer}__` : "";

    dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: user.id,
      guildId: guild.id,
      discordUserId: message.author.id,
      discordGuildId: message.guild.id,
      actionType: CurrencyHistoryActionType.DAILY,
      currencyType: CurrencyHistoryCurrencyType.POINT,
      bet: null,
      outcome: dailyAmount,
      metadata: null,
      hasProfited: true,
    });

    const currentPoints = responseUtils.formatCurrency({
      guild,
      amount: userUpdated.points,
      useBold: true,
    });

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(`📅 + ${dailyAmount} memes`)
      .setDescription(
        `You redeemed your daily ${responseUtils.getPointsDisplayName({
          guild,
        })}${extra}! You now have ${currentPoints}`,
      );

    return message.channel.send(embed);
  },
};
