import DataLoader from "dataloader";

import { DataLoaderParams } from "./dataLoaders";

import { GuildTableRaw, Table } from "~/database/types";

export class PrefixDataLoader extends DataLoader<string, string> {
  constructor(opts: DataLoaderParams) {
    super(async (keys) => {
      const personRows = await opts
        .knex<GuildTableRaw>(Table.GUILDS)
        .whereIn("discordId", keys);

      const persons = personRows.reduce<{ [key: string]: string }>(
        (prev, current) => ({
          ...prev,
          [current.discordId]: current.prefix,
        }),
        {},
      );

      return keys.map((key) => persons[key.toString()] ?? null);
    });
  }
}
