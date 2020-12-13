import { Command } from "discord.js";

import { inputUtils } from "~/utils/inputUtils";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

export const SLOTS_MIN_AMOUNT = 10;

type Fruit = {
  value: string;
  emoji: string;
  multiplier: number;
};

const fruits = [
  { value: "honeyPot", emoji: ":honey_pot:", multiplier: 10 },
  { value: "eggplant", emoji: ":eggplant:", multiplier: 6.5 },
  { value: "banana", emoji: ":banana:", multiplier: 5 },
  { value: "peach", emoji: ":peach:", multiplier: 3.5 },
  { value: "cherries", emoji: ":cherries:", multiplier: 2.5 },
  { value: "apple", emoji: ":apple:", multiplier: 2 },
];

const createColumnOfFruits = () => mathUtils.shuffleList(fruits).slice(0, 3);

const createGrid = () => [
  createColumnOfFruits(),
  createColumnOfFruits(),
  createColumnOfFruits(),
];

const joinRow = (items: Fruit[]) =>
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

export const slotsCommand: Command = {
  name: "Slots",
  command: "slotmachine",
  aliases: ["slots"],
  syntax: "<amount>",
  examples: ["50", "third", "35%"],
  isAdmin: false,
  description: "Gamble your money with slots",

  // eslint-disable-next-line max-statements
  async execute(message, args, { dataSources }) {
    if (args.length === 0) {
      const valuesMessage = Object.values(fruits)
        .map((fruit) => `${fruit.emoji} ${fruit.multiplier}x`)
        .join("\n");

      const embed = responseUtils
        .positive({ discordUser: message.author })
        .setTitle("Slotmachine")
        .addField("Multipliers", valuesMessage);

      return message.channel.send(embed);
    }

    const user = await dataSources.userDS.tryGetUser({
      userDiscordId: message.author.id,
    });

    const gamblingAmount = await inputUtils.getAmountFromUserInput({
      input: args[0],
      currentPoints: user.points,
    });

    if (!gamblingAmount) {
      const embed = responseUtils.invalidCurrency({
        discordUser: message.author,
      });

      return message.channel.send(embed);
    }

    // VALUE TOO LOW
    if (gamblingAmount < SLOTS_MIN_AMOUNT) {
      const embed = responseUtils.insufficientMinAmount({
        discordUser: message.author,
        minAmount: SLOTS_MIN_AMOUNT,
      });

      return message.channel.send(embed);
    }

    // NOT ENOUGH MONEY
    if (user.points < gamblingAmount) {
      const embed = responseUtils.insufficientFunds({
        discordUser: message.author,
        user,
      });

      return message.channel.send(embed);
    }

    const gridv1 = createGrid();
    const gridv2 = createGrid();
    const gridv3 = createGrid();

    const msg1 = responseUtils
      .neutral({ discordUser: message.author })
      .setTitle("=== SLOTS ===")
      .setDescription(createEmbedBody(gridv1));
    const msg2 = responseUtils
      .neutral({ discordUser: message.author })
      .setTitle("=== SLOTS ===")
      .setDescription(createEmbedBody(gridv2));

    const matches = getStraights(gridv3);
    const hasWon = !!matches.length;

    const multiplier = hasWon
      ? matches.reduce<number>((acc, curr) => acc + curr.multiplier, 0)
      : 1;

    const outcomeAmount = Math.floor(gamblingAmount * multiplier);
    const modifiedUser = await dataSources.userDS.tryModifyCurrency({
      userDiscordId: message.author.id,
      modifyPoints: hasWon ? outcomeAmount : outcomeAmount * -1,
    });

    const sentMessage = await message.channel.send(msg1);

    await timeUtils.sleep(500);
    await sentMessage.edit({ embed: msg2 });

    const msg3Base = hasWon
      ? responseUtils.positive({ discordUser: message.author })
      : responseUtils.negative({ discordUser: message.author });

    const msg3 = msg3Base
      .setTitle("=== SLOTS ===")
      .setDescription(createEmbedBody(gridv3));

    if (hasWon) {
      msg3.addField(
        `+ ${outcomeAmount} points`,
        `Your new total is **${modifiedUser.points}** points`,
      );
      msg3.addField("Stake", `${gamblingAmount} points`);
      msg3.addField(
        "Multiplier",
        matches.map((match) => `${match.emoji} ${match.multiplier}x`),
      );
    } else {
      msg3.addField(
        `- ${outcomeAmount} points`,
        `Your new total is **${modifiedUser.points}** points`,
      );
    }

    await timeUtils.sleep(500);
    await sentMessage.edit({ embed: msg3 });
  },
};
