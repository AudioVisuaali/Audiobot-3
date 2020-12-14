import { CreateServiceOptions } from "~/services/ServiceWithContext";
import { AnimalService } from "~/services/animalService";
import { CurrencyService } from "~/services/currencyService";
import { GoogleService } from "~/services/google";
import { IPService } from "~/services/ipService";
import { JokesService } from "~/services/jokesService";
import { StatsService } from "~/services/statsService";
import { TimeoutService } from "~/services/timeoutServices";

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
