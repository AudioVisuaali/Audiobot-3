import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "../database/types";
import { validateFormatMessageKey } from "../translations/formatter";
import { mathUtils } from "../utils/mathUtil";
import { responseUtils } from "../utils/responseUtils";
import { timeUtils } from "../utils/timeUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

enum ReactType {
  Success = "✅",
  Failure = "❌",
}

type Bait = {
  emoji: string;
  name: string;
  price: number;
  changeDiscount: number;
};

const baits: Bait[] = [
  { emoji: "🪱", name: "Worm", price: 5, changeDiscount: 100 },
  { emoji: "🍗", name: "Chicken", price: 12, changeDiscount: 200 },
  { emoji: "🥟", name: "Dumpling", price: 28, changeDiscount: 300 },
];

const itemGrops = {
  high: [
    { emoji: "📀", name: "DVD", value: 200 },
    { emoji: "💿", name: "CD", value: 150 },
    { emoji: "🥇", name: "Medal", value: 100 },
    { emoji: "🐡", name: "Blowfish", value: 80 },
    { emoji: "🐟", name: "Fish", value: 55 },
    { emoji: "🐠", name: "Tropical Fish", value: 75 },
  ],
  medium: [
    { emoji: "🍆", name: "Eggplant", value: 20 },
    { emoji: "🍑", name: "Peach", value: 25 },
    { emoji: "🍌", name: "Banana", value: 18 },
    { emoji: "🍕", name: "Pizza", value: 17 },
    { emoji: "🍘", name: "Rice Cracker", value: 22 },
  ],
  low: [
    { emoji: "⚽", name: "Soccer", value: 1 },
    { emoji: "👢", name: "Boots", value: 5 },
    { emoji: "⚰️", name: "Coffin", value: 4 },
    { emoji: "📎", name: "Paperclip", value: 1 },
    { emoji: "🔎", name: "Magnifying Glass", value: 5 },
    { emoji: "🛒", name: "Shopping Cart", value: 5 },
    { emoji: "🔒", name: "Lock", value: 4 },
    { emoji: "📐", name: "Triangular Ruler", value: 1 },
    { emoji: "💩", name: "Poop", value: 2 },
    { emoji: "👞", name: "Shoe", value: 1 },
    { emoji: "☂️", name: "Umbrella", value: 4 },
  ],
};

const getRandomItemGroup = (discount: number) => {
  const randomValue = mathUtils.getRandomArbitrary(0, 400 - discount);

  if (randomValue <= 10) {
    return itemGrops.high;
  }

  if (randomValue <= 50) {
    return itemGrops.medium;
  }

  return itemGrops.low;
};

const getRandomItem = (discount?: number) => {
  const itemGroup = getRandomItemGroup(discount || 0);
  const randomValue = mathUtils.getRandomArbitrary(0, itemGroup.length - 1);

  return itemGroup[randomValue];
};

const getBaitDiscount = (baitName: string) => {
  const bait = baits.find(
    (bait) =>
      bait.name.toLowerCase() === baitName.toLowerCase() ||
      bait.emoji === baitName,
  );

  return bait ?? null;
};

class FishingCommand extends AbstractCommand {
  private async showBaits() {
    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandFishingTitleBaits"))
      .setDescription(
        this.formatMessage("commandFishingDescriptionBaits", {
          prefix: guild.prefix,
        }),
      )
      .addFields(
        baits.map((bait) => {
          const baitPoints = responseUtils.formatCurrency({
            guild,
            amount: bait.price,
            useBold: true,
          });

          return {
            name: bait.name,
            value: `${bait.emoji} ${baitPoints}`,
          };
        }),
      );

    return await this.message.channel.send({ embeds: [embed] });
  }

  private isBaitCommand() {
    return (
      this.args.length === 1 &&
      (this.args[0] === "baits" || this.args[0] === "bait")
    );
  }

  private async sendBaitNotFound() {
    const embed = responseUtils
      .invalidParameter({ discordUser: this.message.author })
      .setDescription(
        this.formatMessage("commandFishingDescriptionBaitNotFound", {
          name: this.args[0],
        }),
      );

    return await this.message.channel.send({ embeds: [embed] });
  }

  // eslint-disable-next-line max-statements, complexity
  public async execute() {
    if (this.isBaitCommand()) {
      return await this.showBaits();
    }

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    const bait = this.args.length ? getBaitDiscount(this.args[0]) : null;

    if (this.args[0] && !bait) {
      return await this.sendBaitNotFound();
    }

    if (bait) {
      if (user.points < bait.price) {
        const embed = responseUtils
          .insufficientFunds({ discordUser: this.message.author, guild, user })
          .setDescription(
            this.formatMessage("commandFishingNotEnoughCurrency"),
          );

        return await this.message.channel.send({ embeds: [embed] });
      }

      await this.dataSources.currencyHistoryDS.addCurrencyHistory({
        userId: user.id,
        guildId: guild.id,
        discordGuildId: this.message.guild.id,
        discordUserId: this.message.author.id,
        actionType: CurrencyHistoryActionType.FISHING_BAIT,
        currencyType: CurrencyHistoryCurrencyType.POINT,
        bet: null,
        outcome: -bait.price,
        metadata: bait.emoji,
        hasProfited: false,
      });
    }

    const fishingEmbed = responseUtils
      .neutral({ discordUser: this.message.author })
      .setTitle(
        this.formatMessage("commandFishingWaitingTitle", {
          username: this.message.author.username,
        }),
      )
      .setDescription(this.formatMessage("commandFishingWaitingDescription"));

    if (bait) {
      fishingEmbed.addFields({
        name: this.formatMessage("commandFishingBait"),
        value: bait.emoji,
      });
    }

    const fishingMessage = await this.message.channel.send({
      embeds: [fishingEmbed],
    });

    const fishingDurationMS = mathUtils.getRandomArbitrary(100000, 30000);
    await timeUtils.sleep(fishingDurationMS);

    await fishingMessage.delete();

    const fishingItem = getRandomItem(bait?.changeDiscount);

    const sellForPoints = responseUtils.formatCurrency({
      guild,
      amount: fishingItem.value,
      useBold: true,
    });

    const sellEmbed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(
        `🎣 **${this.message.author.username}** caught a ${fishingItem.emoji}`,
      )
      .setDescription(`Do you want to sell it for ${sellForPoints}`);

    if (bait) {
      sellEmbed.addFields({
        name: this.formatMessage("commandFishingBait"),
        value: bait.emoji,
        inline: true,
      });
    }

    const sellMessage = await this.message.channel.send({
      embeds: [sellEmbed],
    });

    await sellMessage.react(ReactType.Success);
    await sellMessage.react(ReactType.Failure);

    const reactionCollection = await sellMessage.awaitReactions({
      max: 1,
      time: 15000,
      filter: (reaction) =>
        reaction.emoji.name !== "" &&
        [ReactType.Success, ReactType.Failure].includes(
          reaction.emoji.name as ReactType,
        ),
    });

    await sellMessage.delete();

    const fishingItemPoints = responseUtils.formatCurrency({
      guild,
      amount: fishingItem.value,
      useBold: true,
    });

    if (reactionCollection.get(ReactType.Success)) {
      const updatedUser = await this.dataSources.userDS.tryModifyCurrency({
        guildDiscordId: this.message.guild.id,
        userDiscordId: this.message.author.id,
        modifyPoints: fishingItem.value,
      });

      await this.dataSources.currencyHistoryDS.addCurrencyHistory({
        userId: user.id,
        guildId: guild.id,
        discordGuildId: this.message.guild.id,
        discordUserId: this.message.author.id,
        actionType: CurrencyHistoryActionType.FISHING,
        currencyType: CurrencyHistoryCurrencyType.POINT,
        bet: null,
        outcome: fishingItem.value,
        metadata: bait
          ? `BAIT: ${bait.emoji}, ${fishingItem.emoji}`
          : fishingItem.emoji,
        hasProfited: true,
      });

      const userNewTotalPoints = await responseUtils.formatCurrency({
        guild,
        amount: updatedUser.points,
        useBold: true,
      });

      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setTitle(
          this.formatMessage("commandFishingSoldTitle", {
            username: this.message.author.username,
            itemDisplay: fishingItem.emoji,
          }),
        )
        .setDescription(
          this.formatMessage("commandFishingSoldDescription", {
            itemWorth: fishingItemPoints,
            itemDisplay: fishingItem.emoji,
          }),
        )
        .addFields({
          name: this.formatMessage("commandFishingSoldNewTotal"),
          value: userNewTotalPoints,
          inline: true,
        });

      if (bait) {
        embed.addFields({
          name: this.formatMessage("commandFishingBait"),
          value: bait.emoji,
          inline: true,
        });
      }

      return await this.message.channel.send({ embeds: [embed] });
    }

    if (reactionCollection.get(ReactType.Failure)) {
      const embed = responseUtils
        .neutral({ discordUser: this.message.author })
        .setTitle(
          this.formatMessage("commandFishingNotSoldTitle", {
            username: this.message.author.username,
            itemDisplay: fishingItem.emoji,
          }),
        )
        .setDescription(
          this.formatMessage("commandFishingNotSoldDescription", {
            username: this.message.author.username,
          }),
        )
        .addFields({
          name: this.formatMessage("commandFishingNotSoldItemValue"),
          value: fishingItemPoints,
          inline: true,
        });

      if (bait) {
        embed.addFields({
          name: this.formatMessage("commandFishingBait"),
          value: bait.emoji,
          inline: true,
        });
      }

      return await this.message.channel.send({ embeds: [embed] });
    }

    const embed = responseUtils
      .negative({ discordUser: this.message.author })
      .setTitle(
        this.formatMessage("commandFishingMissedTitle", {
          username: this.message.author.username,
          itemDisplay: fishingItem.emoji,
        }),
      )
      .addFields({
        name: this.formatMessage("commandFishingMissedItemValue"),
        value: fishingItemPoints,
        inline: true,
      });

    if (bait) {
      embed.addFields({
        name: this.formatMessage("commandFishingBait"),
        value: bait.emoji,
        inline: true,
      });
    }

    return await this.message.channel.send({ embeds: [embed] });
  }
}

export const fishingCommand: Command = {
  emoji: "🎣",
  name: validateFormatMessageKey("commandFishingMetaName"),
  description: validateFormatMessageKey("commandFishingMetaDescription"),
  command: "fishing",
  aliases: ["fish"],
  syntax: "<?<<baits | bait> | <baitName>>>",
  examples: ["", "baits", baits[0].name.toLowerCase()],
  isAdmin: false,

  getCommand(payload) {
    return new FishingCommand(payload);
  },
};
