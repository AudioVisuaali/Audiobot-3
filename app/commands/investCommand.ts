/* eslint-disable switch-case/no-case-curly */
import { DateTime } from "luxon";

import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

const description =
  "Invest your money to get a weekly 1% payback. For your money to get compounded you need to keep your money invested for a week.";

class InvestCommand extends AbstractCommand {
  // eslint-disable-next-line complexity, max-statements
  async execute() {
    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    if (this.args.length === 0) {
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

      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setTitle("💰 Invest")
        .setDescription(description)
        .addField(
          "Next compound",
          timeUtils.durationObjectToString(nextCompound),
        )
        .addField("Invested", userInvestedPoints, true)
        .addField("Next compound worth", nextCompoundPoints, true);

      return await this.message.channel.send(embed);
    }

    if (this.args.length !== 2) {
      const embed = responseUtils.invalidAmountOfArguments({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    if (
      !["add", "put", "deposit", "take", "withdraw", "remove"].includes(
        this.args[0],
      )
    ) {
      const embed = responseUtils
        .invalidParameter({ discordUser: this.message.author })
        .setDescription(
          "Invalid action name. You can only **remove** or **add*",
        );

      return await this.message.channel.send(embed);
    }

    switch (this.args[0]) {
      case "put":
      case "add":
      case "deposit": {
        const transferAmount = inputUtils.getAmountFromUserInput({
          input: this.args[1],
          currentPoints: user.points,
        });

        if (!transferAmount) {
          const embed = responseUtils.invalidCurrency({
            discordUser: this.message.author,
          });

          return await this.message.channel.send(embed);
        }

        if (transferAmount > user.points) {
          const embed = responseUtils.insufficientFunds({
            discordUser: this.message.author,
            user,
            guild,
          });

          return await this.message.channel.send(embed);
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
          .setTitle("💰 Investment")
          .setDescription(`You invested ${transferAmountPoints}`)
          .addField(
            "New balance",
            [
              `:purse: ${updatedUserPoints}`,
              `:moneybag: ${updatedUserStockPoints}`,
            ].join("\n"),
          );

        return await this.message.channel.send(embed);
      }

      // eslint-disable-next-line switch-case/no-case-curly
      case "take":
      case "withdraw":
      case "remove": {
        const transferAmount = inputUtils.getAmountFromUserInput({
          input: this.args[1],
          currentPoints: user.stock,
        });

        if (!transferAmount) {
          const embed = responseUtils.invalidCurrency({
            discordUser: this.message.author,
          });

          return await this.message.channel.send(embed);
        }

        if (transferAmount > user.stock) {
          const embed = responseUtils.insufficientFundsStock({
            discordUser: this.message.author,
            user,
            guild,
          });

          return await this.message.channel.send(embed);
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
                  (user.stockMinCompoundAmount -
                    (user.stock - transferAmount)) *
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

        const embed = responseUtils
          .positive({ discordUser: this.message.author })
          .setTitle("💰 Investment")
          .setDescription(`You withdrawed ${transferAmountPoints}`)
          .addField(
            "New balance",
            [
              `:purse: ${updatedUserPoints}`,
              `:moneybag: ${updatedUserStockPoints}`,
            ].join("\n"),
          );

        return await this.message.channel.send(embed);
      }
    }
  }
}

export const investCommand: Command = {
  emoji: "💰",
  name: "Invest",
  command: "invest",
  aliases: ["bank"],
  syntax: "<<add|put|deposit> | <take|withdraw|remove>> <amount>",
  examples: ["", "add 500", "deposit 50%", "take 200", "remove half"],
  isAdmin: false,
  description,

  getCommand(payload) {
    return new InvestCommand(payload);
  },
};
