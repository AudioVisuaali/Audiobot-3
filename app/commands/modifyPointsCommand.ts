import { Command } from "~/commands/commands";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";
import { inputUtils } from "~/utils/inputUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

export const modifyPointsCommand: Command = {
  emoji: "💫",
  name: "Modify Points",
  command: "modifyPoints",
  aliases: ["modifyP", "modifypoints"],
  syntax: "<add | remove> @user <amount>",
  examples: ["add <@user> 10000"],
  isAdmin: false,
  description: "Modify users currency",

  // eslint-disable-next-line max-statements
  async execute(message, args, { dataSources }) {
    if (message.author.id !== message.guild.ownerID) {
      const embed = responseUtils.invalidPermissions({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    if (args.length !== 3) {
      const embed = responseUtils.invalidParameter({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    const mentionedUser = inputUtils.getUserMention({
      message,
      mentionInString: args[1],
    });

    if (!mentionedUser) {
      const embed = responseUtils.invalidReferenceUser({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    const amount = mathUtils.parseStringToNumber(args[2]);

    if (amount === null || amount < 1) {
      const embed = responseUtils.invalidParameter({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: mentionedUser.id,
      guildDiscordId: message.guild.id,
    });

    const modifyAmount = args[0] === "add" ? amount : amount * -1;

    if (user.points + modifyAmount < 0) {
      const embed = responseUtils
        .invalidCurrency({ discordUser: message.author })
        .setDescription("Users new currency cannot be negative");

      return message.channel.send(embed);
    }

    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
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
        .invalidParameter({ discordUser: message.author })
        .setDescription(`You can only add from ${minPonts} to ${maxPonts}`);

      return message.channel.send(embed);
    }

    if (!["add", "remove"].includes(args[0])) {
      const embed = responseUtils.invalidParameter({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    const modifiedUser = await dataSources.userDS.tryModifyCurrency({
      userDiscordId: mentionedUser.id,
      guildDiscordId: message.guild.id,
      modifyPoints: modifyAmount,
    });

    await dataSources.currencyHistoryDS.addCurrencyHistory({
      userId: modifiedUser.id,
      guildId: guild.id,
      discordUserId: mentionedUser.id,
      discordGuildId: message.guild.id,
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
      .positive({ discordUser: message.author })
      .setTitle("Modified users balance")
      .setDescription(responseUtils.quoteUser({ user: mentionedUser }))
      .addField("New balance", newBalancePoints);

    return message.channel.send(embed);
  },
};
