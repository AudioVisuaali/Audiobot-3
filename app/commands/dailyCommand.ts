import { DateTime } from "luxon";

import { GuildTable } from "../dataSources/GuildDataSource";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "../database/types";
import { validateFormatMessageKey } from "../translations/formatter";
import { mathUtils } from "../utils/mathUtil";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

type DailyRetrievedTrue = { available: true; availableAt: null };
type DailyRetrievedFalse = { available: false; availableAt: DateTime };

class DailyCommand extends AbstractCommand {
  private getDailyFix() {
    const luckinessProbability = mathUtils.getRandomArbitrary(0, 99);

    if (luckinessProbability < 1) {
      return { multiplier: 4 };
    }

    if (luckinessProbability < 5) {
      return { multiplier: 2 };
    }

    return { multiplier: 1 };
  }

  private async isDailyAvailable(): Promise<
    DailyRetrievedTrue | DailyRetrievedFalse
  > {
    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    if (!user.dailyRetrieved) {
      return { available: true, availableAt: null };
    }

    const dailyAvailableTime = user.dailyRetrieved.plus({ day: 1 });
    const currentTime = DateTime.utc();

    if (dailyAvailableTime.valueOf() < currentTime.valueOf()) {
      return { available: true, availableAt: null };
    }

    return { available: false, availableAt: dailyAvailableTime };
  }

  private getDailyAmounts() {
    const dailyBase = mathUtils.getRandomArbitrary(380, 420);

    const { multiplier } = this.getDailyFix();

    return {
      dailyBase,
      multiplier,
      dailyTotal: dailyBase * multiplier,
    };
  }

  private async getUserAndGuild() {
    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    return { user, guild };
  }

  public async execute() {
    const dailyAvailable = await this.isDailyAvailable();

    if (!dailyAvailable.available) {
      const embed = responseUtils.cooldown({
        discordUser: this.message.author,
        availableAt: dailyAvailable.availableAt,
      });

      return await this.message.channel.send({ embeds: [embed] });
    }

    const { user, guild } = await this.getUserAndGuild();
    const { multiplier, dailyTotal } = this.getDailyAmounts();

    const userUpdated = await this.dataSources.userDS.tryModifyCurrency({
      guildDiscordId: this.message.guild.id,
      userDiscordId: this.message.author.id,
      modifyPoints: dailyTotal,
      updateDailyClaimed: true,
    });

    await this.dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: user.id,
      guildId: guild.id,
      discordUserId: this.message.author.id,
      discordGuildId: this.message.guild.id,
      actionType: CurrencyHistoryActionType.DAILY,
      currencyType: CurrencyHistoryCurrencyType.POINT,
      bet: null,
      outcome: dailyTotal,
      metadata: null,
      hasProfited: true,
    });

    const currencyName = responseUtils.getPointsDisplayName({
      guild,
    });

    const messageType = multiplier === 1 ? "commandDaily1x" : "commandDaily?x";

    const embed = this.createEmbed({ guild, dailyTotal }).setDescription(
      this.formatMessage(messageType, {
        currencyName,
        multiplier,
        newTotalAmount: userUpdated.points,
      }),
    );

    return await this.message.channel.send({ embeds: [embed] });
  }

  private createEmbed(params: { guild: GuildTable; dailyTotal: number }) {
    const currencyName = responseUtils.getPointsDisplayName({
      guild: params.guild,
    });

    return responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(
        this.formatMessage("commandDailyTitle", {
          dailyTotal: params.dailyTotal,
          currencyName,
        }),
      );
  }
}

export const dailyCommand: Command = {
  emoji: "📅",
  name: validateFormatMessageKey("commandDailyMetaName"),
  description: validateFormatMessageKey("commandDailyMetaDescription"),
  command: "daily",
  aliases: ["kela"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new DailyCommand(payload);
  },
};
