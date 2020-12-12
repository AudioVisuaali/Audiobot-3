import { CreateServiceOptions } from "./ServiceWithContext";
import { AnimalService } from "./animalService";
import { CurrencyService } from "./currencyService";
import { GoogleService } from "./google";
import { IPService } from "./ipService";
import { JokesService } from "./jokesService";
import { StatsService } from "./statsService";
import { TimeoutService } from "./timeoutServices";

export type Services = {
  timeout: TimeoutService;
  jokes: JokesService;
  currency: CurrencyService;
  animal: AnimalService;
  stats: StatsService;
  google: GoogleService;
  ip: IPService;
};

export const createServices = (opts: CreateServiceOptions): Services => ({
  timeout: new TimeoutService(),
  jokes: new JokesService(opts),
  currency: new CurrencyService(opts),
  animal: new AnimalService(opts),
  stats: new StatsService(opts),
  google: new GoogleService(opts),
  ip: new IPService(opts),
});
