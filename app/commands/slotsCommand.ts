import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import {
  CurrencyHistoryActionType,
  CurrencyHistoryCurrencyType,
} from "~/database/types";
import { inputUtils } from "~/utils/inputUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

export const SLOTS_MIN_AMOUNT = 10;

type Multiplier = {
  value: string;
  emoji: string;
  multiplier: number;
};

const formatMultiplier = (multiplier: Multiplier) =>
  `${multiplier.emoji} ${multiplier.multiplier}x`;

const casinoBonus = {
  value: "casino",
  emoji: "🎰 Casino",
  multiplier: 1,
};

const fruits: Multiplier[] = [
  { value: "honeyPot", emoji: "🍯", multiplier: 7.5 },
  { value: "eggplant", emoji: "🍆", multiplier: 5.5 },
  { value: "banana", emoji: "🍌", multiplier: 4 },
  { value: "peach", emoji: "🍑", multiplier: 3 },
  { value: "cherries", emoji: "🍒", multiplier: 2.5 },
  { value: "apple", emoji: "🍎", multiplier: 2 },
];

const createColumnOfFruits = () => mathUtils.shuffleList(fruits).slice(0, 3);

const createGrid = () => [
  createColumnOfFruits(),
  createColumnOfFruits(),
  createColumnOfFruits(),
];

const joinRow = (items: Multiplier[]) =>
  items.map((value) => `[${value.emoji}]`).join(" - ");

type Grid = ReturnType<typeof createGrid>;

const createEmbedBody = (grid: Grid) => {
  const row1 = joinRow([grid[0][0], grid[1][0], grid[2][0]]);
  const row2 = joinRow([grid[0][1], grid[1][1], grid[2][1]]);
  const row3 = joinRow([grid[0][2], grid[1][2], grid[2][2]]);

  return `${row1}‎‎‎‎‎‎‎‎‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‎‏:red_circle:
${row2} :french_bread:
${row3}\n`;
};

const getStraights = (grid: Grid) => {
  const matches = [];

  for (let i = 0; i < 3; i += 1) {
    const row = grid[i];
    if (row[0].value === row[1].value && row[1].value === row[2].value) {
      matches.push(row[0]);
    }
  }

  for (let i = 0; i < 3; i += 1) {
    if (
      grid[0][i].value === grid[1][i].value &&
      grid[1][i].value === grid[2][i].value
    ) {
      matches.push(grid[1][i]);
    }
  }

  if (
    grid[0][0].value === grid[1][1].value &&
    grid[1][1].value === grid[2][2].value
  ) {
    matches.push(grid[0][0]);
  }

  if (
    grid[0][2].value === grid[1][1].value &&
    grid[1][1].value === grid[2][0].value
  ) {
    matches.push(grid[0][0]);
  }

  return matches;
};

class SlotsCommand extends AbstractCommand {
  // eslint-disable-next-line max-statements
  async execute() {
    if (this.args.length === 0) {
      const valuesMessage = Object.values(fruits)
        .map((fruit) => `${fruit.emoji} ${fruit.multiplier}x`)
        .join("\n");

      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setTitle("🎰 Slotmachine")
        .addField("Multipliers", valuesMessage);

      return await this.message.channel.send(embed);
    }

    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    const guild = await this.dataSources.guildDS.tryGetGuild({
      guildDiscordId: this.message.guild.id,
    });

    const gamblingAmount = await inputUtils.getAmountFromUserInput({
      input: this.args[0],
      currentPoints: user.points,
    });

    if (!gamblingAmount) {
      const embed = responseUtils.invalidCurrency({
        discordUser: this.message.author,
      });

      return await this.message.channel.send(embed);
    }

    // VALUE TOO LOW
    if (gamblingAmount < SLOTS_MIN_AMOUNT) {
      const embed = responseUtils.insufficientMinAmount({
        discordUser: this.message.author,
        minAmount: SLOTS_MIN_AMOUNT,
        guild,
      });

      return await this.message.channel.send(embed);
    }

    // NOT ENOUGH MONEY
    if (user.points < gamblingAmount) {
      const embed = responseUtils.insufficientFunds({
        discordUser: this.message.author,
        user,
        guild,
      });

      return await this.message.channel.send(embed);
    }

    const isInCasinoChannel = guild.casinoChannelId
      ? guild.casinoChannelId === this.message.channel.id
      : false;

    const gridv1 = createGrid();
    const gridv2 = createGrid();
    const gridv3 = createGrid();

    const msg1 = responseUtils
      .neutral({ discordUser: this.message.author })
      .setTitle("=== SLOTS ===")
      .setDescription(createEmbedBody(gridv1));
    const msg2 = responseUtils
      .neutral({ discordUser: this.message.author })
      .setTitle("=== SLOTS ===")
      .setDescription(createEmbedBody(gridv2));

    const matches = getStraights(gridv3);
    const hasWon = !!matches.length;

    const multiplierBase = isInCasinoChannel ? 1 : 0;

    const multiplier = hasWon
      ? matches.reduce<number>(
          (acc, curr) => acc + curr.multiplier,
          multiplierBase,
        )
      : 1;

    const outcomeAmount = Math.floor(gamblingAmount * multiplier);
    const modifiedUser = await this.dataSources.userDS.tryModifyCurrency({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
      modifyPoints: hasWon ? outcomeAmount : outcomeAmount * -1,
    });

    const sentMessage = await this.message.channel.send(msg1);

    await timeUtils.sleep(500);
    await sentMessage.edit({ embed: msg2 });

    const msg3Base = hasWon
      ? responseUtils.positive({ discordUser: this.message.author })
      : responseUtils.negative({ discordUser: this.message.author });

    const msg3 = msg3Base
      .setTitle("=== SLOTS ===")
      .setDescription(createEmbedBody(gridv3));

    if (hasWon) {
      const newTotalPoints = responseUtils.formatCurrency({
        guild,
        amount: modifiedUser.points,
        useBold: true,
      });

      const gamblingAmountPoints = responseUtils.formatCurrency({
        guild,
        amount: gamblingAmount,
        useBold: true,
      });

      msg3.addField(
        `+ ${outcomeAmount} points`,
        `Your new total is ${newTotalPoints}`,
      );
      msg3.addField("Stake", gamblingAmountPoints);

      const matchesAll = isInCasinoChannel
        ? [...matches, casinoBonus]
        : matches;

      const mappedMultipliers = matchesAll.map(formatMultiplier);
      msg3.addField("Multiplier", mappedMultipliers.join("\n"));
      await this.dataSources.currencyHistoryDS.addCurrencyHistory({
        userId: user.id,
        guildId: guild.id,
        discordGuildId: this.message.guild.id,
        discordUserId: this.message.author.id,
        actionType: CurrencyHistoryActionType.SLOTS,
        currencyType: CurrencyHistoryCurrencyType.POINT,
        bet: gamblingAmount,
        outcome: outcomeAmount,
        metadata: mappedMultipliers.join(", "),
        hasProfited: true,
      });
    } else {
      await this.dataSources.currencyHistoryDS.addCurrencyHistory({
        userId: user.id,
        guildId: guild.id,
        discordGuildId: this.message.guild.id,
        discordUserId: this.message.author.id,
        actionType: CurrencyHistoryActionType.SLOTS,
        currencyType: CurrencyHistoryCurrencyType.POINT,
        bet: gamblingAmount,
        outcome: outcomeAmount * -1,
        metadata: null,
        hasProfited: false,
      });

      const outcomeAmountPoints = responseUtils.formatCurrency({
        guild,
        amount: outcomeAmount * -1,
        useBold: true,
      });

      const newTotalPoints = responseUtils.formatCurrency({
        guild,
        amount: modifiedUser.points,
        useBold: true,
      });

      msg3.addField(outcomeAmountPoints, `Your new total is ${newTotalPoints}`);
    }

    await timeUtils.sleep(500);
    await sentMessage.edit({ embed: msg3 });
  }
}

export const slotsCommand: Command = {
  emoji: "🎰",
  name: "Slots",
  command: "slotmachine",
  aliases: ["slots"],
  syntax: "<amount>",
  examples: ["50", "third", "35%"],
  isAdmin: false,
  description: "Gamble your money with slots",

  getCommand(payload) {
    return new SlotsCommand(payload);
  },
};
