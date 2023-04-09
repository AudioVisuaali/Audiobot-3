import { CommandPayload } from "../handlers/onMessage";
import { TranslationKey } from "../translations/formatter";

import { AbstractCommand } from "./AbstractCommand";
import { agifyCommand } from "./agifyCommand";
import { avatarCommand } from "./avatarCommand";
import { bitcoinCommand } from "./bitcoinCommand";
import { boredCommand } from "./boredCommand";
import { casinoCommand } from "./casinoCommand";
import { catFactCommand } from "./catFactCommand";
import { catPictureCommand } from "./catPictureCommand";
import { chooseCommand } from "./chooseCommand";
import { chuckNorrisCommand } from "./chuckNorrisCommand";
import { currencyCommand } from "./currencyCommand";
import { dadJokeCommand } from "./dadJokeCommand";
import { dailyCommand } from "./dailyCommand";
import { diceCommand } from "./diceCommand";
import { dogFactCommand } from "./dogFactCommand";
import { dogPictureCommand } from "./dogPictureCommand";
import { eightBallCommand } from "./eightBallCommand";
import { fingerporiCommand } from "./fingerporiCommand";
import { fishingCommand } from "./fishingCommand";
import { genderCommand } from "./genderCommand";
import { helpCommand } from "./helpCommand";
import { historyCommand } from "./historyCommand";
import { holidayCommand } from "./holidayCommand";
import { investCommand } from "./investCommand";
import { ipCommand } from "./ipCommand";
import { joinVoiceCommand } from "./joinVoiceAFKCommand";
import { lennyfaceCommand } from "./lennyfaceCommand";
import { modifyPointsCommand } from "./modifyPointsCommand";
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
import { statsCommand } from "./statsCommand";
import { stockCommand } from "./stockCommand";
import { tokensCommand } from "./tokensCommand";
import { topCommand } from "./topCommand";
import { transferCommand } from "./transferCommand";
import { urbanCommand } from "./urbanCommand";
import { weatherCommand } from "./weatherCommand";
import { wikipediaCommand } from "./wikipediaCommand";
import { yoMamaCommand } from "./yoMamaCommand";

export interface Command {
  emoji: string;
  name: TranslationKey;
  command: string;
  aliases: string[];
  description: TranslationKey;
  syntax: string;
  examples: string[];
  isAdmin: boolean;

  getCommand: (payload: CommandPayload) => AbstractCommand;
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
  boredCommand,
  reverseCommand,
  spongebobCommand,
  urbanCommand,
  holidayCommand,
  lennyfaceCommand,
  rollCommand,
  agifyCommand,
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
  statsCommand,
  fingerporiCommand,
  currencyCommand,
  fishingCommand,
  topCommand,
  modifyPointsCommand,
  pingCommand,
  joinVoiceCommand,
];

type SortedModules = {
  commands: Command[];
  adminCommands: Command[];
};

export const getCommand = (params: { name: string }) =>
  commands.find(
    (command) =>
      command.command === params.name || command.aliases.includes(params.name),
  );

export const sortedModules = commands.reduce<SortedModules>(
  (prev, curr) => ({
    commands: curr.isAdmin ? prev.commands : [...prev.commands, curr],
    adminCommands: curr.isAdmin
      ? [...prev.adminCommands, curr]
      : prev.adminCommands,
  }),
  { commands: [], adminCommands: [] },
);
