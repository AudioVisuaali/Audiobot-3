import { Message } from "discord.js";

import { avatarCommand } from "~/commands/avatarCommand";
import { bitcoinCommand } from "~/commands/bitcoinCommand";
import { casinoCommand } from "~/commands/casinoCommand";
import { catFactCommand } from "~/commands/catFactCommand";
import { catPictureCommand } from "~/commands/catPictureCommand";
import { chooseCommand } from "~/commands/chooseCommand";
import { chuckNorrisCommand } from "~/commands/chuckNorrisCommand";
import { dadJokeCommand } from "~/commands/dadJokeCommand";
import { dailyCommand } from "~/commands/dailyCommand";
import { diceCommand } from "~/commands/diceCommand";
import { dogFactCommand } from "~/commands/dogFactCommand";
import { dogPictureCommand } from "~/commands/dogPictureCommand";
import { eightBallCommand } from "~/commands/eightBallCommand";
import { genderCommand } from "~/commands/genderCommand";
import { helpCommand } from "~/commands/helpCommand";
import { historyCommand } from "~/commands/historyCommand";
import { investCommand } from "~/commands/investCommand";
import { ipCommand } from "~/commands/ipCommand";
import { lennyfaceCommand } from "~/commands/lennyfaceCommand";
import { numberfactCommand } from "~/commands/numberfactCommand";
import { osuCommand } from "~/commands/osuCommand";
import { pingCommand } from "~/commands/pingCommand";
import { pointsCommand } from "~/commands/pointsCommand";
import { prefixCommand } from "~/commands/prefixCommand";
import { punCommand } from "~/commands/punCommand";
import { reverseCommand } from "~/commands/reverseCommand";
import { rollCommand } from "~/commands/rollCommand";
import { rouletteCommand } from "~/commands/rouletteCommand";
import { serverCommand } from "~/commands/serverCommand";
import { slotsCommand } from "~/commands/slotsCommand";
import { spongebobCommand } from "~/commands/spongebobCommand";
import { stockCommand } from "~/commands/stockCommand";
import { tokensCommand } from "~/commands/tokensCommand";
import { transferCommand } from "~/commands/transferCommand";
import { urbanCommand } from "~/commands/urbanCommand";
import { weatherCommand } from "~/commands/weatherCommand";
import { wikipediaCommand } from "~/commands/wikipediaCommand";
import { yoMamaCommand } from "~/commands/yoMamaCommand";
import { Context } from "~/context";

export interface Command {
  name: string;
  command: string;
  aliases: string[];
  description: string;
  syntax: string;
  examples: string[];
  isAdmin: boolean;

  execute: (
    message: Message,
    args: string[],
    context: Context,
  ) => unknown | Promise<unknown>;
}

export const commands: Command[] = [
  helpCommand,
  bitcoinCommand,
  yoMamaCommand,
  catPictureCommand,
  catFactCommand,
  dogPictureCommand,
  dogFactCommand,
  chuckNorrisCommand,
  dadJokeCommand,
  diceCommand,
  eightBallCommand,
  genderCommand,
  ipCommand,
  numberfactCommand,
  punCommand,
  reverseCommand,
  spongebobCommand,
  urbanCommand,
  lennyfaceCommand,
  rollCommand,
  dailyCommand,
  rouletteCommand,
  pointsCommand,
  tokensCommand,
  slotsCommand,
  wikipediaCommand,
  serverCommand,
  chooseCommand,
  prefixCommand,
  investCommand,
  transferCommand,
  stockCommand,
  avatarCommand,
  weatherCommand,
  osuCommand,
  casinoCommand,
  historyCommand,
  pingCommand,
];

type SortedModules = {
  commands: Command[];
  adminCommands: Command[];
};

export const sortedModules = commands.reduce<SortedModules>(
  (prev, curr) => ({
    commands: curr.isAdmin ? prev.commands : [...prev.commands, curr],
    adminCommands: curr.isAdmin
      ? [...prev.adminCommands, curr]
      : prev.adminCommands,
  }),
  { commands: [], adminCommands: [] },
);
