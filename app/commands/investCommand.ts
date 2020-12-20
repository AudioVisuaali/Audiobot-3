/* eslint-disable switch-case/no-case-curly */
import { DateTime } from "luxon";

import { Command } from "~/commands/commands";
import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

const description =
  "Invest your money to get a weekly 1% payback. For your money to get compounded you need to keep your money invested for a week.";

export const investCommand: Command = {
  emoji: "💰",
  name: "Invest",
  command: "invest",
  aliases: ["bank"],
  syntax: "<<add|put|deposit> | <take|withdraw|remove>> <amount>",
  examples: ["", "add 500", "deposit 50%", "take 200", "remove half"],
  isAdmin: false,
  description,

  // eslint-disable-next-line complexity, max-statements
  async execute(message, args, { dataSources }) {
    if (!message.guild) {
      return;
    }

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
      guildDiscordId: message.guild.id,
    });

    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    if (args.length === 0) {
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
        .positive({ discordUser: message.author })
        .setTitle("💰 Invest")
        .setDescription(description)
        .addField(
          "Next compound",
          timeUtils.durationObjectToString(nextCompound),
        )
        .addField("Invested", userInvestedPoints, true)
        .addField("Next compound worth", nextCompoundPoints, true);

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
            guild,
          });

          return message.channel.send(embed);
        }

        const updatedUser = await dataSources.userDS.tryModifyCurrency({
          userDiscordId: message.author.id,
          guildDiscordId: message.guild.id,
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
          .positive({ discordUser: message.author })
          .setTitle("💰 Investment")
          .setDescription(`You invested ${transferAmountPoints}`)
          .addField(
            "New balance",
            [
              `:purse: ${updatedUserPoints}`,
              `:moneybag: ${updatedUserStockPoints}`,
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
            guild,
          });

          return message.channel.send(embed);
        }

        const minCompoundChanges =
          user.stock - transferAmount < user.stockMinCompoundAmount;

        const updatedUser = await dataSources.userDS.tryModifyCurrency({
          guildDiscordId: message.guild.id,
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
          .positive({ discordUser: message.author })
          .setTitle("💰 Investment")
          .setDescription(`You withdrawed ${transferAmountPoints}`)
          .addField(
            "New balance",
            [
              `:purse: ${updatedUserPoints}`,
              `:moneybag: ${updatedUserStockPoints}`,
            ].join("\n"),
          );

        return message.channel.send(embed);
      }
    }
  },
};
