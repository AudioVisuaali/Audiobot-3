import { Command } from "~/commands/commands";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

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

export const fishingCommand: Command = {
  emoji: "🎣",
  name: "Fishing",
  command: "fishing",
  aliases: ["fish"],
  syntax: "<?<<baits | bait> | <baitName>>>",
  examples: ["", "baits", baits[0].name.toLowerCase()],
  isAdmin: false,
  description: "Relaxing fishing",

  // eslint-disable-next-line max-statements, complexity
  async execute(message, args, { dataSources }) {
    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    if (args.length === 1 && (args[0] === "baits" || args[0] === "bait")) {
      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setTitle("🎣 Fishing baits")
        .setDescription(
          `Use baits to increase your change of getting a valuable drop. To use baits use **${guild.prefix}fishing <baitName>**`,
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

      return message.channel.send(embed);
    }

    const bait = args.length ? getBaitDiscount(args[0]) : null;

    if (args[0] && !bait) {
      const embed = responseUtils
        .invalidParameter({ discordUser: message.author })
        .setDescription(`Bait **${args[0]}** was not found`);

      return message.channel.send(embed);
    }

    if (bait) {
      if (user.points < bait.price) {
        const embed = responseUtils
          .insufficientFunds({ discordUser: message.author, guild, user })
          .setDescription("You dont have currency to purchase the bait");

        return message.channel.send(embed);
      }

      dataSources.currencyHistoryDS.addCurrencyHistory({
        userId: user.id,
        guildId: guild.id,
        discordGuildId: message.guild.id,
        discordUserId: message.author.id,
        actionType: CurrencyHistoryActionType.FISHING_BAIT,
        currencyType: CurrencyHistoryCurrencyType.POINT,
        bet: null,
        outcome: -bait.price,
        metadata: bait.emoji,
        hasProfited: false,
      });
    }

    const fishingEmbed = responseUtils
      .neutral({ discordUser: message.author })
      .setTitle(`🎣 ${message.author.username} is fishing`)
      .setDescription("Please wait untill you catch a fish...");

    if (bait) {
      fishingEmbed.addField("Bait", bait.emoji);
    }

    const fishingMessage = await message.channel.send(fishingEmbed);

    const fishingDurationMS = mathUtils.getRandomArbitrary(100000, 30000);
    await timeUtils.sleep(fishingDurationMS);

    fishingMessage.delete();

    const fishingItem = getRandomItem(bait?.changeDiscount);

    const sellForPoints = responseUtils.formatCurrency({
      guild,
      amount: fishingItem.value,
      useBold: true,
    });

    const sellEmbed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(
        `🎣 **${message.author.username}** caught a ${fishingItem.emoji}`,
      )
      .setDescription(`Do you want to sell it for ${sellForPoints}`);

    if (bait) {
      sellEmbed.addField("Bait", bait.emoji, true);
    }

    const sellMessage = await message.channel.send(sellEmbed);

    sellMessage.react(ReactType.Success);
    sellMessage.react(ReactType.Failure);

    const reactionCollection = await sellMessage.awaitReactions(
      (reaction) =>
        reaction.users.cache.get(message.author.id) &&
        [ReactType.Success, ReactType.Failure].includes(reaction.emoji.name),
      { max: 1, time: 15000 },
    );

    sellMessage.delete();

    const fishingItemPoints = responseUtils.formatCurrency({
      guild,
      amount: fishingItem.value,
      useBold: true,
    });

    if (reactionCollection.get(ReactType.Success)) {
      const updatedUser = await dataSources.userDS.tryModifyCurrency({
        userDiscordId: message.author.id,
        modifyPoints: fishingItem.value,
      });

      dataSources.currencyHistoryDS.addCurrencyHistory({
        userId: user.id,
        guildId: guild.id,
        discordGuildId: message.guild.id,
        discordUserId: message.author.id,
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
        .positive({ discordUser: message.author })
        .setTitle(`🎣 ${message.author.username} sold ${fishingItem.emoji}`)
        .setDescription(
          `You gained ${fishingItemPoints} for selling ${fishingItem.emoji}`,
        )
        .addField("Your new total is", userNewTotalPoints, true);

      if (bait) {
        embed.addField("Bait", bait.emoji, true);
      }

      return message.channel.send(embed);
    }

    if (reactionCollection.get(ReactType.Failure)) {
      const embed = responseUtils
        .neutral({ discordUser: message.author })
        .setTitle(`🎣 ${message.author.username} found ${fishingItem.emoji}`)
        .setDescription(
          `**${message.author.username}** decided not to sell found item`,
        )
        .addField("Item value", fishingItemPoints, true);

      if (bait) {
        embed.addField("Bait", bait.emoji, true);
      }

      return message.channel.send(embed);
    }

    const embed = responseUtils
      .negative({ discordUser: message.author })
      .setTitle(
        `🎣  ${message.author.username} missed on item ${fishingItem.emoji}`,
      )
      .addField("Item value", fishingItemPoints, true);

    if (bait) {
      embed.addField("Bait", bait.emoji, true);
    }

    return message.channel.send(embed);
  },
};
