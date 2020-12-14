import { Command } from "~/commands/commands";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";
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

  // eslint-disable-next-line max-statements
  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    if (args.length === 0) {
      const embed = responseUtils.specifyGamblingAmount({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    const isInCasinoChannel = guild.casinoChannelId
      ? guild.casinoChannelId === message.channel.id
      : false;

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
      const embed = responseUtils.invalidCurrency({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    // NOT ENOUGH MONEY
    if (user.points < gambleAmount) {
      const embed = responseUtils.insufficientFunds({
        discordUser: message.author,
        user,
        guild,
      });

      return message.channel.send(embed);
    }

    // Rigged
    const winNumber = mathUtils.getRandomArbitrary(0, 99);
    const hasWon = isInCasinoChannel ? winNumber < 42 : winNumber < 49;

    if (!hasWon) {
      const userLost = await dataSources.userDS.tryModifyCurrency({
        userDiscordId: message.author.id,
        modifyPoints: gambleAmount * -1,
      });

      const gambleAmountPoints = responseUtils.formatCurrency({
        guild,
        amount: gambleAmount * -1,
      });

      const gambleAmountPointsBold = responseUtils.formatCurrency({
        guild,
        amount: gambleAmount,
        useBold: true,
      });

      const userLostPoints = responseUtils.formatCurrency({
        guild,
        amount: userLost.points,
        useBold: true,
      });

      const embed = responseUtils
        .negative({ discordUser: message.author })
        .setTitle(`:slot_machine: ${gambleAmountPoints}`)
        .setDescription(
          `You have lost ${gambleAmountPointsBold}, you now have ${userLostPoints}`,
        );

      dataSources.currencyHistoryDS.addCurrencyHistory({
        userId: user.id,
        guildId: guild.id,
        discordUserId: message.author.id,
        discordGuildId: message.guild.id,
        actionType: CurrencyHistoryActionType.ROULETTE,
        currencyType: CurrencyHistoryCurrencyType.POINT,
        bet: gambleAmount,
        outcome: gambleAmount * -1,
        metadata: null,
        hasProfited: false,
      });

      return message.channel.send(embed);
    }

    const { percent, bonusCurrent } = mathUtils.getBonusCount({
      current: gambleAmount,
    });

    const modifyPoints = isInCasinoChannel
      ? gambleAmount + bonusCurrent
      : gambleAmount;

    const userWon = await dataSources.userDS.tryModifyCurrency({
      userDiscordId: message.author.id,
      modifyPoints,
    });

    const modifyPointsPoints = responseUtils.formatCurrency({
      guild,
      amount: modifyPoints,
      positivePrefix: true,
    });

    const modifyPointsPointsBold = responseUtils.formatCurrency({
      guild,
      amount: modifyPoints,
      useBold: true,
    });

    const userWonPoints = responseUtils.formatCurrency({
      guild,
      amount: userWon.points,
      useBold: true,
    });

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(modifyPointsPoints)
      .setDescription(
        `You have won ${modifyPointsPointsBold}, you now have ${userWonPoints}`,
      );

    if (isInCasinoChannel) {
      const bonusPoints = responseUtils.formatCurrency({
        guild,
        amount: bonusCurrent,
      });

      embed.addField(
        "Casino addition :confetti_ball:",
        `+ ${bonusPoints} / ${percent}%`,
      );
    }

    const bonusCurrentPoints = responseUtils.formatCurrency({
      guild,
      amount: bonusCurrent,
    });

    dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: user.id,
      guildId: guild.id,
      discordUserId: message.author.id,
      discordGuildId: message.guild.id,
      actionType: CurrencyHistoryActionType.ROULETTE,
      currencyType: CurrencyHistoryCurrencyType.POINT,
      bet: gambleAmount,
      outcome: modifyPoints,
      metadata: `Casino +${bonusCurrentPoints} / ${percent}%`,
      hasProfited: true,
    });

    return message.channel.send(embed);
  },
};
