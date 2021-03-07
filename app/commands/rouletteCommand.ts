import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";
import { inputUtils } from "~/utils/inputUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const ROULETTER_MIN_POT = 10;

class RouletteCommand extends AbstractCommand {
  // eslint-disable-next-line max-statements
  async execute() {
    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    if (this.args.length === 0) {
      const embed = responseUtils.specifyGamblingAmount({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const isInCasinoChannel = guild.casinoChannelId
      ? guild.casinoChannelId === this.message.channel.id
      : false;

    const gambleAmount = await inputUtils.getAmountFromUserInput({
      input: this.args[0],
      currentPoints: user.points,
    });

    // INVALID INPUT
    if (!gambleAmount) {
      const embed = responseUtils.invalidCurrency({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    // VALUE TOO LOW
    if (user.points < ROULETTER_MIN_POT) {
      const embed = responseUtils.invalidCurrency({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    // NOT ENOUGH MONEY
    if (user.points < gambleAmount) {
      const embed = responseUtils.insufficientFunds({
        discordUser: this.message.author,
        user,
        guild,
      });

      return await this.message.channel.send(embed);
    }

    // Rigged
    const winNumber = mathUtils.getRandomArbitrary(0, 99);
    const hasWon = isInCasinoChannel ? winNumber < 42 : winNumber < 49;

    if (!hasWon) {
      const userLost = await this.dataSources.userDS.tryModifyCurrency({
        userDiscordId: this.message.author.id,
        guildDiscordId: this.message.guild.id,
        modifyPoints: gambleAmount * -1,
      });

      const gambleAmountPointsLost = responseUtils.formatCurrency({
        guild,
        amount: gambleAmount * -1,
      });

      const gambleAmountPoints = responseUtils.formatCurrency({
        guild,
        amount: gambleAmount,
      });

      const userLostPoints = responseUtils.formatCurrency({
        guild,
        amount: userLost.points,
        useBold: true,
      });

      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle(
          this.formatMessage("commandRouletteLostTitle", {
            gambleAmount: gambleAmountPointsLost,
          }),
        )
        .setDescription(
          this.formatMessage("commandRouletteLostDescription", {
            gambleAmounts: gambleAmountPoints,
            userLostPoints: userLostPoints,
          }),
        );

      await this.dataSources.currencyHistoryDS.addCurrencyHistory({
        userId: user.id,
        guildId: guild.id,
        discordUserId: this.message.author.id,
        discordGuildId: this.message.guild.id,
        actionType: CurrencyHistoryActionType.ROULETTE,
        currencyType: CurrencyHistoryCurrencyType.POINT,
        bet: gambleAmount,
        outcome: gambleAmount * -1,
        metadata: null,
        hasProfited: false,
      });

      return await this.message.channel.send(embed);
    }

    const { percent, bonusCurrent } = mathUtils.getBonusCount({
      current: gambleAmount,
    });

    const modifyPoints = isInCasinoChannel
      ? gambleAmount + bonusCurrent
      : gambleAmount;

    const userWon = await this.dataSources.userDS.tryModifyCurrency({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
      modifyPoints,
    });

    const modifyPointsPoints = responseUtils.formatCurrency({
      guild,
      amount: modifyPoints,
      positivePrefix: true,
    });

    const userWonPoints = responseUtils.formatCurrency({
      guild,
      amount: userWon.points,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(modifyPointsPoints)
      .setDescription(
        this.formatMessage("commandRouletteWinDescription", {
          gambleAmount: modifyPointsPoints,
          userWonPoints: userWonPoints,
        }),
      );

    if (isInCasinoChannel) {
      const bonusPoints = responseUtils.formatCurrency({
        guild,
        amount: bonusCurrent,
      });

      embed.addField(
        this.formatMessage("commandRouletteWinCasinoAddition"),
        `+ ${bonusPoints} / ${percent}%`,
      );
    }

    const bonusCurrentPoints = responseUtils.formatCurrency({
      guild,
      amount: bonusCurrent,
    });

    await this.dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: user.id,
      guildId: guild.id,
      discordUserId: this.message.author.id,
      discordGuildId: this.message.guild.id,
      actionType: CurrencyHistoryActionType.ROULETTE,
      currencyType: CurrencyHistoryCurrencyType.POINT,
      bet: gambleAmount,
      outcome: modifyPoints,
      metadata: isInCasinoChannel
        ? `Casino +${bonusCurrentPoints} / ${percent}%`
        : null,
      hasProfited: true,
    });

    return await this.message.channel.send(embed);
  }
}

export const rouletteCommand: Command = {
  emoji: "🎮",
  name: "Roulette",
  command: "roulette",
  aliases: [],
  syntax: "<amount>",
  examples: ["50", "half", "60%"],
  isAdmin: false,
  description: "Gamble your money in roulette",

  getCommand(payload) {
    return new RouletteCommand(payload);
  },
};
