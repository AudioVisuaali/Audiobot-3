import { GamesService } from "./gamesService";

import { CreateServiceOptions } from "~/services/ServiceWithContext";
import { AnimalService } from "~/services/animalService";
import { CurrencyService } from "~/services/currencyService";
import { IPService } from "~/services/ipService";
import { JokesService } from "~/services/jokesService";
import { StatsService } from "~/services/statsService";
import { TimeoutService } from "~/services/timeoutServices";

export type Services = {
  timeout: TimeoutService;
  games: GamesService;
  jokes: JokesService;
  currency: CurrencyService;
  animal: AnimalService;
  stats: StatsService;
  ip: IPService;
};

export const createServices = (opts: CreateServiceOptions): Services => ({
  timeout: new TimeoutService(),
  games: new GamesService(opts),
  jokes: new JokesService(opts),
  currency: new CurrencyService(opts),
  animal: new AnimalService(opts),
  stats: new StatsService(opts),
  ip: new IPService(opts),
});
