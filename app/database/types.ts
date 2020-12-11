export enum Table {
  USERS = "users",
  GUILDS = "guilds",
}

export const tableColumn = <T extends Tables>(table: Table, column: keyof T) =>
  [table, column].join(".");

type Tables = UserTableRaw | GuildTableRaw | CommandTableRaw;

export type UserTableRaw = Readonly<{
  id: number;
  uuid: string;
  discordId: string;
  points: number;
  bank: number;
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
  discordId: string;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type CommandTableRaw = Readonly<{
  id: number;
  uuid: string;
  guildId: number;
  addedBy: number;
  command: string;
  response: string;
  timesUser: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}>;
