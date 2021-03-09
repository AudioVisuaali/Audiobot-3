import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";
import { validateFormatMessageKey } from "~/translations/formatter";
import { inputUtils } from "~/utils/inputUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

enum CommandType {
  Add = "add",
  Remove = "remove",
}

class ModifyPointsCommand extends AbstractCommand {
  private hasPermission() {
    return this.message.author.id === this.message.guild.ownerID;
  }

  // eslint-disable-next-line max-statements
  public async execute() {
    if (!this.hasPermission()) {
      const embed = responseUtils.invalidPermissions({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    if (this.args.length !== 3) {
      const embed = responseUtils.invalidParameter({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    const mentionedUser = inputUtils.getUserMention({
      message: this.message,
      mentionInString: this.args[1],
    });

    if (!mentionedUser) {
      const embed = responseUtils.invalidReferenceUser({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    const amount = mathUtils.parseStringToNumber(this.args[2]);

    if (amount === null || amount < 1) {
      const embed = responseUtils.invalidParameter({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: mentionedUser.id,
      guildDiscordId: this.message.guild.id,
    });

    const modifyAmount =
      this.args[0] === CommandType.Add ? amount : amount * -1;

    if (user.points + modifyAmount < 0) {
      const embed = responseUtils
        .invalidCurrency({ discordUser: this.message.author })
        .setDescription(
          this.formatMessage("commandModifyPointsCannotBeNegative"),
        );

      return await this.message.channel.send(embed);
    }

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const minPonts = responseUtils.formatCurrency({
      guild,
      amount: 1,
      useBold: true,
    });

    const maxPonts = responseUtils.formatCurrency({
      guild,
      amount: 1,
      useBold: true,
    });

    if (amount < 1 || amount > 100000) {
      const embed = responseUtils
        .invalidParameter({ discordUser: this.message.author })
        .setDescription(
          this.formatMessage("commandModifyPointsAddMinMax", {
            minPonts,
            maxPonts,
          }),
        );

      return await this.message.channel.send(embed);
    }

    if (!this.isValidCommandType()) {
      const embed = responseUtils.invalidParameter({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    const modifiedUser = await this.dataSources.userDS.tryModifyCurrency({
      userDiscordId: mentionedUser.id,
      guildDiscordId: this.message.guild.id,
      modifyPoints: modifyAmount,
    });

    await this.dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: modifiedUser.id,
      guildId: guild.id,
      discordUserId: mentionedUser.id,
      discordGuildId: this.message.guild.id,
      actionType: CurrencyHistoryActionType.OWNER_MODIFY,
      currencyType: CurrencyHistoryCurrencyType.POINT,
      bet: null,
      outcome: amount,
      metadata: "Server owner modified your balance",
      hasProfited: modifyAmount < 0,
    });

    const newBalancePoints = responseUtils.formatCurrency({
      guild,
      amount: modifiedUser.points,
      useBold: true,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandModifyPointsModifiedBalance"))
      .setDescription(responseUtils.quoteUser({ user: mentionedUser }))
      .addField(
        this.formatMessage("commandModifyPointsNewBalance"),
        newBalancePoints,
      );

    return await this.message.channel.send(embed);
  }

  private isValidCommandType() {
    return [CommandType.Add, CommandType.Remove].includes(
      this.args[0] as CommandType,
    );
  }
}

export const modifyPointsCommand: Command = {
  emoji: "💫",
  name: validateFormatMessageKey("commandModifyPointsMetaName"),
  description: validateFormatMessageKey("commandModifyPointsMetaDescription"),
  command: "modifyPoints",
  aliases: ["modifyP", "modifypoints"],
  syntax: "<add | remove> <@user> <amount>",
  examples: ["add @user 10000"],
  isAdmin: false,

  getCommand(payload) {
    return new ModifyPointsCommand(payload);
  },
};
