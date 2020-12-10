import Knex from "knex";

import { PrefixDataLoader } from "./prefixDataLoader";

export type DataLoaders = {
  prefixDL: PrefixDataLoader;
};

export type DataLoaderParams = {
  knex: Knex;
};

export const createDataLoaders = (opts: DataLoaderParams) => ({
  prefixDL: new PrefixDataLoader(opts),
});
