import { Command } from "discord.js";

import { inputUtils } from "~/utils/inputUtils";
import { responseUtils } from "~/utils/responseUtils";

export const transferCommand: Command = {
  name: "Transfer",
  command: "transfer",
  aliases: ["give"],
  syntax: "<@User> <amount>",
  examples: ["@Bot 500", "@Bot 50%"],
  isAdmin: false,
  description: "Transfer money for other users",

  async execute(message, args, { dataSources }) {
    if (!message.author) {
      return;
    }

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    if (args.length !== 2) {
      const embed = responseUtils.invalidAmountOfArguments({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    const userMentioned = inputUtils.getUserMention({
      message,
      mentionInString: args[0],
    });

    if (!userMentioned) {
      const embed = responseUtils.invalidReferenceUser({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    if (userMentioned.id === message.author.id) {
      const embed = responseUtils.cannotReferenceSelf({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    const transferrableAmount = inputUtils.getAmountFromUserInput({
      input: args[1],
      currentPoints: user.points,
    });

    if (!transferrableAmount) {
      const embed = await responseUtils.invalidCurrency({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    if (transferrableAmount > user.points) {
      const embed = responseUtils.insufficientFunds({
        discordUser: message.author,
        user,
      });

      return message.channel.send(embed);
    }

    const receivingUser = await dataSources.userDS.verifyUser({
      userDiscordId: userMentioned.id,
    });

    const updatedDonor = await dataSources.userDS.tryModifyCurrency({
      userDiscordId: message.author.id,
      modifyPoints: transferrableAmount * -1,
    });

    const updatedReceiver = await dataSources.userDS.tryModifyCurrency({
      userDiscordId: receivingUser.discordId,
      modifyPoints: transferrableAmount,
    });

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(":moneybag: Transfer")
      .setDescription(
        `<@${message.author.id}> gave **${transferrableAmount}** points to <@${userMentioned.id}>`,
      )
      .addField(
        "New balance",
        [
          `<@${message.author.id}> ${updatedDonor.points} points`,
          `<@${userMentioned.id}> ${updatedReceiver.points} points`,
        ].join("\n"),
      );

    message.channel.send(embed);
  },
};
