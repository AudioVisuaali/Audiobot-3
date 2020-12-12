import { Message, Client } from "discord.js";

import { bitcoinCommand } from "./bitcoinCommand";
import { catFactCommand } from "./catFactCommand";
import { catPictureCommand } from "./catPictureCommand";
import { chuckNorrisCommand } from "./chuckNorrisCommand";
import { dadJokeCommand } from "./dadJokeCommand";
import { dailyCommand } from "./dailyCommand";
import { diceCommand } from "./diceCommand";
import { dogFactCommand } from "./dogFactCommand";
import { dogPictureCommand } from "./dogPictureCommand";
import { eightBallCommand } from "./eightBallCommand";
import { genderCommand } from "./genderCommand";
import { helpCommand } from "./helpCommand";
import { ipCommand } from "./ipCommand";
import { lennyfaceCommand } from "./lennyfaceCommand";
import { numberfactCommand } from "./numberfactCommand";
import { pingCommand } from "./pingCommand";
import { pointsCommand } from "./pointsCommand";
import { punCommand } from "./punCommand";
import { reverseCommand } from "./reverseCommand";
import { rollCommand } from "./rollCommand";
import { rouletteCommand } from "./rouletteCommand";
import { slotsCommand } from "./slotsCommand";
import { spongebobCommand } from "./spongebobCommand";
import { tokensCommand } from "./tokensCommand";
import { urbanCommand } from "./urbanCommand";
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
  pingCommand,
];

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
