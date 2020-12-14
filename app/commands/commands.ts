import { Message } from "discord.js";

import { avatarCommand } from "./avatarCommand";
import { bitcoinCommand } from "./bitcoinCommand";
import { casinoCommand } from "./casinoCommand";
import { catFactCommand } from "./catFactCommand";
import { catPictureCommand } from "./catPictureCommand";
import { chooseCommand } from "./chooseCommand";
import { chuckNorrisCommand } from "./chuckNorrisCommand";
import { dadJokeCommand } from "./dadJokeCommand";
import { dailyCommand } from "./dailyCommand";
import { diceCommand } from "./diceCommand";
import { dogFactCommand } from "./dogFactCommand";
import { dogPictureCommand } from "./dogPictureCommand";
import { eightBallCommand } from "./eightBallCommand";
import { genderCommand } from "./genderCommand";
import { helpCommand } from "./helpCommand";
import { historyCommand } from "./historyCommand";
import { investCommand } from "./investCommand";
import { ipCommand } from "./ipCommand";
import { lennyfaceCommand } from "./lennyfaceCommand";
import { numberfactCommand } from "./numberfactCommand";
import { osuCommand } from "./osuCommand";
import { pingCommand } from "./pingCommand";
import { pointsCommand } from "./pointsCommand";
import { prefixCommand } from "./prefixCommand";
import { punCommand } from "./punCommand";
import { reverseCommand } from "./reverseCommand";
import { rollCommand } from "./rollCommand";
import { rouletteCommand } from "./rouletteCommand";
import { serverCommand } from "./serverCommand";
import { slotsCommand } from "./slotsCommand";
import { spongebobCommand } from "./spongebobCommand";
import { stockCommand } from "./stockCommand";
import { tokensCommand } from "./tokensCommand";
import { transferCommand } from "./transferCommand";
import { urbanCommand } from "./urbanCommand";
import { weatherCommand } from "./weatherCommand";
import { wikipediaCommand } from "./wikipediaCommand";
import { yoMamaCommand } from "./yoMamaCommand";

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

export const modules: Command[] = [
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
