import DataLoader from "dataloader";

import { DataLoaderParams } from "./dataLoaders";

import { ServerTableRaw, Table } from "~/database/types";

export class PrefixDataLoader extends DataLoader<string, string> {
  constructor(opts: DataLoaderParams) {
    super(async (keys) => {
      const personRows = await opts
        .knex<ServerTableRaw>(Table.GUILDS)
        .whereIn("discordId", keys);

      const persons = personRows.reduce<{ [key: string]: string }>(
        (prev, current) => ({
          ...prev,
          [current.uuid.toString()]: current.prefix,
        }),
        {},
      );

      return keys.map((key) => persons[key.toString()] ?? null);
    });
  }
}
