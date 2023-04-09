import { CreateServiceOptions } from "./ServiceWithContext";
import { AnimalService } from "./animalService";
import { CurrencyService } from "./currencyService";
import { GamesService } from "./gamesService";
import { IPService } from "./ipService";
import { JokesService } from "./jokesService";
import { StatsService } from "./statsService";
import { TimeoutService } from "./timeoutServices";

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
