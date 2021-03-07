import { DateTime } from "luxon";

import { AbstractCommand } from "~/commands/AbstractCommand";
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

class DailyCommand extends AbstractCommand {
  async execute() {
    if (this.args.length !== 0) {
      return await this.message.channel.send("Invalid parameters");
    }

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    if (user.dailyRetrieved) {
      const dailyAvailableTime = user.dailyRetrieved.plus({ day: 1 });
      const currentTime = DateTime.utc();

      if (dailyAvailableTime.valueOf() > currentTime.valueOf()) {
        const embed = responseUtils.cooldown({
          discordUser: this.message.author,
          availableAt: dailyAvailableTime,
        });

        return await this.message.channel.send(embed);
      }
    }

    const dailyAmountBase = mathUtils.getRandomArbitrary(380, 420);
    const luckinessProbability = mathUtils.getRandomArbitrary(0, 99);

    const { multiplier, explainer } = getDailyFix(luckinessProbability);

    const dailyAmount = dailyAmountBase * multiplier;
    const userUpdated = await this.dataSources.userDS.tryModifyCurrency({
      guildDiscordId: this.message.guild.id,
      userDiscordId: this.message.author.id,
      modifyPoints: dailyAmount,
      updateDailyClaimed: true,
    });

    const extra = explainer ? `, __${explainer}__` : "";

    await this.dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: user.id,
      guildId: guild.id,
      discordUserId: this.message.author.id,
      discordGuildId: this.message.guild.id,
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

    const currencyName = responseUtils.getPointsDisplayName({
      guild,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`📅 + ${dailyAmount} ${currencyName}`)
      .setDescription(
        `You redeemed your daily ${currencyName}${extra}! You now have ${currentPoints}`,
      );

    return await this.message.channel.send(embed);
  }
}

export const dailyCommand: Command = {
  emoji: "📅",
  name: "Daily",
  command: "daily",
  aliases: ["kela"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get your daily fix",

  getCommand(payload) {
    return new DailyCommand(payload);
  },
};
