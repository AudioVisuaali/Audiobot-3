import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";
import { validateFormatMessageKey } from "~/translations/formatter";
import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";

class TransferCommand extends AbstractCommand {
  // eslint-disable-next-line max-statements
  public async execute() {
    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    if (this.args.length !== 2) {
      const embed = responseUtils.invalidAmountOfArguments({
        discordUser: this.message.author,
      });

      return this.message.channel.send(embed);
    }

    const userMentioned = inputUtils.getUserMention({
      message: this.message,
      mentionInString: this.args[0],
    });

    if (!userMentioned) {
      const embed = responseUtils.invalidReferenceUser({
        discordUser: this.message.author,
      });

      return this.message.channel.send(embed);
    }

    if (userMentioned.id === this.message.author.id) {
      const embed = responseUtils.cannotReferenceSelf({
        discordUser: this.message.author,
      });

      return this.message.channel.send(embed);
    }

    const transferrableAmount = inputUtils.getAmountFromUserInput({
      input: this.args[1],
      currentPoints: user.points,
    });

    if (!transferrableAmount) {
      const embed = await responseUtils.invalidCurrency({
        discordUser: this.message.author,
      });

      return this.message.channel.send(embed);
    }

    if (transferrableAmount > user.points) {
      const embed = responseUtils.insufficientFunds({
        discordUser: this.message.author,
        user,
        guild,
      });

      return this.message.channel.send(embed);
    }

    const receivingUser = await this.dataSources.userDS.verifyUser({
      guildDiscordId: this.message.guild.id,
      userDiscordId: userMentioned.id,
    });

    const updatedDonor = await this.dataSources.userDS.tryModifyCurrency({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
      modifyPoints: transferrableAmount * -1,
    });

    await this.dataSources.userDS.tryModifyCurrency({
      userDiscordId: receivingUser.discordId,
      guildDiscordId: this.message.guild.id,
      modifyPoints: transferrableAmount,
    });

    await this.dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: user.id,
      guildId: guild.id,
      discordUserId: this.message.author.id,
      discordGuildId: this.message.guild.id,
      actionType: CurrencyHistoryActionType.TRANSFER,
      currencyType: CurrencyHistoryCurrencyType.POINT,
      bet: null,
      outcome: transferrableAmount * -1,
      metadata: `To ${userMentioned.username}`,
      hasProfited: false,
    });

    await this.dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: receivingUser.id,
      guildId: guild.id,
      discordUserId: userMentioned.id,
      discordGuildId: this.message.guild.id,
      actionType: CurrencyHistoryActionType.TRANSFER,
      currencyType: CurrencyHistoryCurrencyType.POINT,
      bet: null,
      outcome: transferrableAmount,
      metadata: `From ${this.message.author.username}`,
      hasProfited: false,
    });

    const transferredPoints = responseUtils.formatCurrency({
      guild,
      amount: transferrableAmount,
      useBold: true,
    });

    const fromUserQuote = responseUtils.quoteUser({
      user: this.message.author,
    });

    const toUserQuote = responseUtils.quoteUser({
      user: userMentioned,
    });

    const fromUserNewBalancePoints = responseUtils.formatCurrency({
      guild,
      amount: updatedDonor.points,
      useBold: true,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandTransferTitle"))
      .setDescription(
        this.formatMessage("commandTransferDescription", {
          sponsor: fromUserQuote,
          transferredPoints: transferredPoints,
          receiver: toUserQuote,
        }),
      )
      .addField(
        "New balance",
        [`${fromUserQuote} ${fromUserNewBalancePoints}`].join("\n"),
      );

    await this.message.channel.send(embed);
  }
}

export const transferCommand: Command = {
  emoji: "💵",
  name: validateFormatMessageKey("commandTransferMetaName"),
  description: validateFormatMessageKey("commandTransferMetaDescription"),
  command: "transfer",
  aliases: ["give"],
  syntax: "<@User> <amount>",
  examples: ["@Bot 500", "@Bot 50%"],
  isAdmin: false,

  getCommand(payload) {
    return new TransferCommand(payload);
  },
};
