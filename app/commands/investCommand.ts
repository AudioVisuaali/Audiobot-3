/* eslint-disable switch-case/no-case-curly */
import { DateTime } from "luxon";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

enum ValidCommand {
  Put = "put",
  Add = "add",
  Deposit = "deposit",

  Take = "take",
  Withdraw = "withdraw",
  Remove = "remove",
}

class InvestCommand extends AbstractCommand {
  private async getUserAndGuild() {
    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    return { user, guild };
  }

  private async handleDeposit() {
    const { user, guild } = await this.getUserAndGuild();

    const transferAmount = inputUtils.getAmountFromUserInput({
      input: this.args[1],
      currentPoints: user.points,
    });

    if (!transferAmount) {
      const embed = responseUtils.invalidCurrency({
        discordUser: this.message.author,
      });

      return await this.message.channel.send({ embeds: [embed] });
    }

    if (transferAmount > user.points) {
      const embed = responseUtils.insufficientFunds({
        discordUser: this.message.author,
        user,
        guild,
      });

      return await this.message.channel.send({ embeds: [embed] });
    }

    const updatedUser = await this.dataSources.userDS.tryModifyCurrency({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
      modifyPoints: transferAmount * -1,
      modifyStock: transferAmount,
    });

    const transferAmountPoints = responseUtils.formatCurrency({
      guild,
      amount: transferAmount,
      useBold: true,
    });

    const updatedUserPoints = responseUtils.formatCurrency({
      guild,
      amount: updatedUser.points,
    });

    const updatedUserStockPoints = responseUtils.formatCurrency({
      guild,
      amount: updatedUser.stock,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandInvestTitle"))
      .setDescription(
        this.formatMessage("commandInvestInvested", {
          amount: transferAmountPoints,
        }),
      )
      .addFields({
        name: this.formatMessage("commandInvestBalance"),
        value: this.formatMessage("commandInvestTotal", {
          userPoints: updatedUserPoints,
          bankPoints: updatedUserStockPoints,
        }),
      });

    return await this.message.channel.send({ embeds: [embed] });
  }

  private async handleWithdraw() {
    const { user, guild } = await this.getUserAndGuild();

    const transferAmount = inputUtils.getAmountFromUserInput({
      input: this.args[1],
      currentPoints: user.stock,
    });

    if (!transferAmount) {
      const embed = responseUtils.invalidCurrency({
        discordUser: this.message.author,
      });

      return await this.message.channel.send({ embeds: [embed] });
    }

    if (transferAmount > user.stock) {
      const embed = responseUtils.insufficientFundsStock({
        discordUser: this.message.author,
        user,
        guild,
      });

      return await this.message.channel.send({ embeds: [embed] });
    }

    const minCompoundChanges =
      user.stock - transferAmount < user.stockMinCompoundAmount;

    const updatedUser = await this.dataSources.userDS.tryModifyCurrency({
      guildDiscordId: this.message.guild.id,
      userDiscordId: this.message.author.id,
      modifyPoints: transferAmount,
      modifyStock: transferAmount * -1,
      ...(minCompoundChanges
        ? {
            modifyStockMinCompoundAmount:
              (user.stockMinCompoundAmount - (user.stock - transferAmount)) *
              -1,
          }
        : {}),
    });

    const transferAmountPoints = responseUtils.formatCurrency({
      guild,
      amount: transferAmount,
      useBold: true,
    });

    const updatedUserPoints = responseUtils.formatCurrency({
      guild,
      amount: updatedUser.points,
    });

    const updatedUserStockPoints = responseUtils.formatCurrency({
      guild,
      amount: updatedUser.stock,
    });

    const embed = this.createEmbed()
      .setDescription(
        this.formatMessage("commandInvestWithdrawed", {
          withdrawedAmount: transferAmountPoints,
        }),
      )
      .addFields({
        name: this.formatMessage("commandInvestBalance"),
        value: this.formatMessage("commandInvestTotal", {
          userPoints: updatedUserPoints,
          bankPoints: updatedUserStockPoints,
        }),
      });

    return await this.message.channel.send({ embeds: [embed] });
  }

  private createEmbed() {
    return responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandInvestTitle"));
  }

  private async sendInformation() {
    const { user, guild } = await this.getUserAndGuild();

    const nextCompoundAt = timeUtils.getNextCompoundAt();
    const now = DateTime.utc();
    const nextCompound = timeUtils.humanReadableTimeBetweenDates(
      now,
      nextCompoundAt,
    );

    const userInvestedPoints = responseUtils.formatCurrency({
      guild,
      amount: user.stock,
    });

    const nextCompoundPoints = responseUtils.formatCurrency({
      guild,
      amount: Math.floor(user.stockMinCompoundAmount * 0.01),
    });

    const embed = this.createEmbed()
      .setDescription(this.formatMessage("commandInvestDescription"))
      .addFields([
        {
          name: this.formatMessage("commandInvestFieldNextCompound"),
          value: timeUtils.durationObjectToString(nextCompound),
        },
        {
          name: this.formatMessage("commandInvestFieldInvested"),
          value: userInvestedPoints,
          inline: true,
        },
        {
          name: this.formatMessage("commandInvestFieldNextCompoundWorth"),
          value: nextCompoundPoints,
          inline: true,
        },
      ]);

    return await this.message.channel.send({ embeds: [embed] });
  }

  private isValidCommand() {
    return Object.values(ValidCommand).includes(this.args[0] as ValidCommand);
  }

  async execute() {
    if (this.args.length === 0) {
      return this.sendInformation();
    }

    if (this.args.length !== 2) {
      const embed = responseUtils.invalidAmountOfArguments({
        discordUser: this.message.author,
      });

      return await this.message.channel.send({ embeds: [embed] });
    }

    if (!this.isValidCommand()) {
      const embed = responseUtils
        .invalidParameter({ discordUser: this.message.author })
        .setDescription(this.formatMessage("commandInvestInvalidCommand"));

      return await this.message.channel.send({ embeds: [embed] });
    }

    switch (this.args[0]) {
      case ValidCommand.Put:
      case ValidCommand.Add:
      case ValidCommand.Deposit:
        return this.handleDeposit();

      case ValidCommand.Take:
      case ValidCommand.Withdraw:
      case ValidCommand.Remove:
        return this.handleWithdraw();
    }
  }
}

export const investCommand: Command = {
  emoji: "💰",
  name: validateFormatMessageKey("commandInvestMetaName"),
  description: validateFormatMessageKey("commandInvestMetaDescription"),
  command: "invest",
  aliases: ["bank"],
  syntax: "<<add|put|deposit> | <take|withdraw|remove>> <amount>",
  examples: ["", "add 500", "deposit 50%", "take 200", "remove half"],
  isAdmin: false,

  getCommand(payload) {
    return new InvestCommand(payload);
  },
};
