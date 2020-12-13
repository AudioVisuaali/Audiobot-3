import { Command } from "discord.js";

import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";

export const investCommand: Command = {
  name: "Invest",
  command: "invest",
  aliases: [],
  syntax: "<add | take> <amount>",
  examples: ["add 500", "add 50%", "take 200", "take half"],
  isAdmin: false,
  description: "Your tokens currently",

  // eslint-disable-next-line max-statements
  async execute(message, args, { dataSources }) {
    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    if (args.length !== 2) {
      return;
    }

    if (!["add", "take"].includes(args[0])) {
      const embed = responseUtils
        .invalidParameter({ discordUser: message.author })
        .setDescription(
          "Invalid action name. You can only **remove** or **add*",
        );

      return message.channel.send(embed);
    }

    switch (args[0]) {
      // eslint-disable-next-line switch-case/no-case-curly
      case "add": {
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
      case "take": {
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
    }
  },
};
