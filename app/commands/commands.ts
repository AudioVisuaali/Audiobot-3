import { Message, Client, Command } from "discord.js";

import { avatarCommand } from "./avatarCommand";
import { bitcoinCommand } from "./bitcoinCommand";
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
import { investCommand } from "./investCommand";
import { ipCommand } from "./ipCommand";
import { lennyfaceCommand } from "./lennyfaceCommand";
import { numberfactCommand } from "./numberfactCommand";
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

export const modules = [
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
  pingCommand,
];

type SortedModules = {
  commands: Command[];
  adminCommands: Command[];
};

export const sortedModules = modules.reduce<SortedModules>(
  (prev, curr) => ({
    commands: curr.isAdmin ? prev.commands : [...prev.commands, curr],
    adminCommands: curr.isAdmin
      ? [...prev.adminCommands, curr]
      : prev.adminCommands,
  }),
  { commands: [], adminCommands: [] },
);

export const setClientModules = (opts: { client: Client }) => {
  for (const command of modules) {
    opts.client.commands.set(command.command, command);
  }
};

export const invokeCommand = (opts: {
  message: Message;
  prefix: string;
  context: Context;
}) => {
  const { commands } = opts.message.client;
  const [commandName, ...args] = getMessageCommandAndArgs({
    message: opts.message,
    prefix: opts.prefix,
  });

  const commandModule =
    commands.get(commandName) ||
    commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!commandModule) {
    return;
  }

  try {
    commandModule.execute(opts.message, args, opts.context);
  } catch (error) {
    opts.context.logger.error(
      "there was an error trying to execute that command",
      { commandName },
      error,
    );
  }
};

export const getMessageCommandAndArgs = (opts: {
  message: Message;
  prefix: string;
}) => opts.message.content.slice(opts.prefix.length).trim().split(/ +/);
