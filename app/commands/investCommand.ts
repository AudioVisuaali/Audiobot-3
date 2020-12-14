/* eslint-disable switch-case/no-case-curly */
import { DateTime } from "luxon";

import { Command } from "~/commands/commands";
import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

const description =
  "Invest your money to get a weekly 1% payback. For your money to get compounded you need to keep your money invested for a week.";

export const investCommand: Command = {
  name: "Invest",
  command: "invest",
  aliases: [],
  syntax: "<<add|put|deposit> | <take|withdraw|remove>> <amount>",
  examples: ["", "add 500", "deposit 50%", "take 200", "remove half"],
  isAdmin: false,
  description,

  // eslint-disable-next-line max-statements
  async execute(message, args, { dataSources }) {
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    if (args.length === 0) {
      const nextCompoundAt = timeUtils.getNextCompoundAt();
      const now = DateTime.utc();
      const nextCompound = timeUtils.humanReadableTimeBetweenDates(
        now,
        nextCompoundAt,
      );

      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setTitle(":moneybag: Invest")
        .setDescription(description)
        .addField("Next compound", timeUtils.nextCompoundString(nextCompound))
        .addField("Invested", `${user.stock} points`, true)
        .addField(
          "Next compound worth",
          `${Math.floor(user.stockMinCompoundAmount * 0.01)} points`,
          true,
        );

      return message.channel.send(embed);
    }

    if (args.length !== 2) {
      const embed = responseUtils.invalidAmountOfArguments({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    if (
      !["add", "put", "deposit", "take", "withdraw", "remove"].includes(args[0])
    ) {
      const embed = responseUtils
        .invalidParameter({ discordUser: message.author })
        .setDescription(
          "Invalid action name. You can only **remove** or **add*",
        );

      return message.channel.send(embed);
    }

    switch (args[0]) {
      case "put":
      case "add":
      case "deposit": {
        const transferAmount = inputUtils.getAmountFromUserInput({
          input: args[1],
          currentPoints: user.points,
        });

        if (!transferAmount) {
          const embed = responseUtils.invalidCurrency({
            discordUser: message.author,
          });

          return message.channel.send(embed);
        }

        if (transferAmount > user.points) {
          const embed = responseUtils.insufficientFunds({
            discordUser: message.author,
            user,
          });

          return message.channel.send(embed);
        }

        const updatedUser = await dataSources.userDS.tryModifyCurrency({
          userDiscordId: message.author.id,
          modifyPoints: transferAmount * -1,
          modifyStock: transferAmount,
        });

        const embed = responseUtils
          .positive({ discordUser: message.author })
          .setTitle("Investment")
          .setDescription(`You invested **${transferAmount}** points`)
          .addField(
            "New balance",
            [
              `:purse: ${updatedUser.points} points`,
              `:moneybag: ${updatedUser.stock} points`,
            ].join("\n"),
          );

        return message.channel.send(embed);
      }

      // eslint-disable-next-line switch-case/no-case-curly
      case "take":
      case "withdraw":
      case "remove": {
        const transferAmount = inputUtils.getAmountFromUserInput({
          input: args[1],
          currentPoints: user.stock,
        });

        if (!transferAmount) {
          const embed = responseUtils.invalidCurrency({
            discordUser: message.author,
          });

          return message.channel.send(embed);
        }

        if (transferAmount > user.stock) {
          const embed = responseUtils.insufficientFundsStock({
            discordUser: message.author,
            user,
          });

          return message.channel.send(embed);
        }

        const minCompoundChanges =
          user.stock - transferAmount < user.stockMinCompoundAmount;

        const updatedUser = await dataSources.userDS.tryModifyCurrency({
          userDiscordId: message.author.id,
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

        const embed = responseUtils
          .positive({ discordUser: message.author })
          .setTitle("Investment")
          .setDescription(`You withdrawed **${transferAmount}** points`)
          .addField(
            "New balance",
            [
              `:purse: ${updatedUser.points} points`,
              `:moneybag: ${updatedUser.stock} points`,
            ].join("\n"),
          );

        return message.channel.send(embed);
      }
    }
  },
};
