import { CreateServiceOptions } from "./ServiceWithContext";
import { AnimalService } from "./animalService";
import { CurrencyService } from "./currencyService";
import { GoogleService } from "./google";
import { IPService } from "./ipService";
import { JokesService } from "./jokesService";
import { StatsService } from "./statsService";
import { TimeoutService } from "./timeoutServices";

export type Services = {
  timeoutService: TimeoutService;
  jokesServices: JokesService;
  currencyService: CurrencyService;
  animalService: AnimalService;
  statsService: StatsService;
  googleService: GoogleService;
  ipService: IPService;
};

export const createServices = (opts: CreateServiceOptions): Services => {
  const timeoutService = new TimeoutService();
  const jokesServices = new JokesService(opts);
  const currencyService = new CurrencyService(opts);
  const animalService = new AnimalService(opts);
  const statsService = new StatsService(opts);
  const googleService = new GoogleService(opts);
  const ipService = new IPService(opts);

  return {
    timeoutService,
    jokesServices,
    currencyService,
    animalService,
    statsService,
    googleService,
    ipService,
  };
};
