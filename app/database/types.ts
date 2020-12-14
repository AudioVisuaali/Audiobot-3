import { Snowflake } from "discord.js";

export enum Table {
  USERS = "users",
  GUILDS = "guilds",
  CURRENCY_HISTORY = "currencyHistory",
  COMMANDS = "commands",
  BOT_INFO = "botInfo",
}

export const tableColumn = <T extends Tables>(table: Table, column: keyof T) =>
  [table, column].join(".");

type Tables = UserTableRaw | GuildTableRaw | CommandTableRaw;

export type UserTableRaw = Readonly<{
  id: number;
  uuid: string;
  discordId: Snowflake;
  points: number;
  stock: number;
  stockMinCompoundAmount: number;
  xp: number;
  tokens: number;
  dailyRetrieved: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type GuildTableRaw = Readonly<{
  id: number;
  uuid: string;
  prefix: string;
  discordId: Snowflake;
  casinoChannelId: Snowflake | null;
  currencyPointsDisplayName: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type CommandTableRaw = Readonly<{
  id: number;
  uuid: string;
  guildId: Snowflake;
  addedBy: number;
  command: string;
  response: string;
  timesUser: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export enum CurrencyHistoryActionType {
  SLOTS = "slots",
  ROULETTE = "roulette",
  DAILY = "daily",
  TRANSFER = "transfer",
}

export enum CurrencyHistoryCurrencyType {
  POINT = "point",
  TOKEN = "token",
}

export type CurrencyHistoryTableRaw = Readonly<{
  id: number;
  uuid: string;
  guildId: number;
  userId: number;
  discordGuildId: Snowflake;
  discordUserId: Snowflake;
  actionType: CurrencyHistoryActionType;
  currencyType: CurrencyHistoryCurrencyType;
  bet: number | null;
  outcome: number | null;
  metadata: string | null;
  hasProfited: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type BotInfoTableRaw = Readonly<{
  id: number;
  uuid: string;
  discordBotId: Snowflake;
  restarts: number;
  createdAt: Date;
  updatedAt: Date | null;
}>;
