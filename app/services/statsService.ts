import axios, { AxiosInstance } from "axios";

import { CreateServiceOptions, ServiceWithContext } from "./ServiceWithContext";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

type GenderResponse = {
  name: string;
  gender: Gender | null;
  probability: number;
  count: number;
};

type UrbanResult = {
  list: {
    author: string;
    // eslint-disable-next-line camelcase
    current_vote: string;
    defid: number;
    definition: string;
    example: string;
    permalink: string;
    // eslint-disable-next-line camelcase
    sound_urls: string[];
    // eslint-disable-next-line camelcase
    thumbs_down: number;
    // eslint-disable-next-line camelcase
    thumbs_up: number;
    word: string;
    // eslint-disable-next-line camelcase
    written_on: string;
  }[];
};

type WikipediaResult = {
  ns: number;
  pageid: number;
  size: number;
  snippet: string;
  timestamp: string;
  title: string;
  wordcount: number;
};

type WikipediaResponse = {
  batchcomplete: string;
  continue: {
    continue: string;
    offset: number;
  };
  query: {
    search: WikipediaResult[];
    searchinfo: {
      suggestion: string;
      suggestionsnippet: string;
      totalhits: number;
    };
  };
};

export type OsuResponse = {
  accuracy: string;
  count50: string;
  count100: string;
  count300: string;
  // eslint-disable-next-line camelcase
  count_rank_a: string;
  // eslint-disable-next-line camelcase
  count_rank_s: string;
  // eslint-disable-next-line camelcase
  count_rank_sh: string;
  // eslint-disable-next-line camelcase
  count_rank_ss: string;
  // eslint-disable-next-line camelcase
  count_rank_ssh: string;
  country: string;
  events: unknown[];
  // eslint-disable-next-line camelcase
  join_date: string;
  level: string;
  playcount: string;
  // eslint-disable-next-line camelcase
  pp_country_rank: string;
  // eslint-disable-next-line camelcase
  pp_rank: string;
  // eslint-disable-next-line camelcase
  pp_raw: string;
  // eslint-disable-next-line camelcase
  ranked_score: string;
  // eslint-disable-next-line camelcase
  total_score: string;
  // eslint-disable-next-line camelcase
  total_seconds_played: string;
  // eslint-disable-next-line camelcase
  user_id: string;
  username: string;
};

type StockResultData = {
  assetClass: string;
  companyName: string;
  exchange: string;
  isHeld: boolean;
  isNasdaq100: boolean;
  isNasdaqListed: boolean;
  keyStats: {
    MarketCap: { label: string; value: string };
    OpenPrice: { label: string; value: string };
    PreviousClose: { label: string; value: string };
    Volume: { label: string; value: string };
  };
  marketStatus: string;
  primaryData: {
    deltaIndicator: string;
    isRealTime: boolean;
    lastSalePrice: string;
    lastTradeTimestamp: string;
    netChange: string;
    percentageChange: string;
  };
  secondaryData: null;
  stockType: string;
  symbol: string;
};

type StockResult = {
  data: StockResultData | null;
  message: null;
  status: {
    bCodeMessage: null;
    developerMessage: null;
    rCode: number;
  };
};

export type WeatherResponse = {
  base: string;
  clouds: { all: number };
  cod: number;
  coord: {
    lon: number;
    lat: number;
  };
  dt: number;
  id: number;
  main: {
    temp: number;
    // eslint-disable-next-line camelcase
    feels_like: number;
    // eslint-disable-next-line camelcase
    temp_min: number;
    // eslint-disable-next-line camelcase
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  name: string;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  visibility: number;
  weather: [{ id: number; main: string; description: string; icon: string }];
  wind: { speed: number; deg: number };
};

export type BoredActivityResponse = {
  activity: string;
  type: string;
  participants: number;
  price: number;
  link: string;
  key: string;
  accessibility: number;
};

export type Holiday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: null | string[];
  launchYear: null;
  type: string;
};

export type HolidayResponse = Holiday[];

export type AgifyResponse = {
  name: string;
  age: number | null;
  count: number;
};

export class StatsService extends ServiceWithContext {
  protected genderApi: AxiosInstance;
  protected numberFactApi: AxiosInstance;
  protected osuApi: AxiosInstance;
  protected urbanApi: AxiosInstance;
  protected wikipediaApi: AxiosInstance;
  protected stockAPI: AxiosInstance;
  protected weatherAPI: AxiosInstance;
  protected boredApi: AxiosInstance;
  protected holidaysApi: AxiosInstance;
  protected agifyApi: AxiosInstance;

  constructor(opts: CreateServiceOptions) {
    super(opts);
    this.genderApi = axios.create({ baseURL: "https://api.genderize.io/" });
    this.numberFactApi = axios.create({ baseURL: "http://numbersapi.com/" });
    this.osuApi = axios.create({
      baseURL: "https://osu.ppy.sh/api/",
      params: { k: opts.config.apiKeys.osu },
    });
    this.urbanApi = axios.create({
      baseURL: "http://api.urbandictionary.com/",
    });
    this.wikipediaApi = axios.create({
      baseURL: "https://en.wikipedia.org/w/api.php",
      params: {
        action: "query",
        list: "search",
        utf8: "",
        format: "json",
      },
    });
    this.stockAPI = axios.create({ baseURL: "https://api.nasdaq.com/api/" });
    this.weatherAPI = axios.create({
      baseURL: "http://api.openweathermap.org/data/2.5/weather/",
      params: { appid: "1d81882a1995f3f7516f9a9619c33e9c" },
    });
    this.boredApi = axios.create({
      baseURL: "https://www.boredapi.com/api/activity",
    });
    this.holidaysApi = axios.create({
      baseURL: "https://date.nager.at/api/v2/publicholidays/",
    });
    this.agifyApi = axios.create({
      baseURL: "https://api.agify.io/",
    });
  }

  public async getGenderOfName(opts: { name: string }) {
    const { data } = await this.genderApi.get<GenderResponse>(
      `/?name=${encodeURI(opts.name)}`,
    );

    return data;
  }

  protected async getDataForNumber(opts: { number: number }) {
    return this.numberFactApi.get<string>(
      `${opts.number}/trivia?notfound=floor&fragment`,
    );
  }

  public async getNumerFact(opts: { number: number }) {
    const { data } = await this.getDataForNumber({ number: opts.number });

    return data;
  }

  public async getOsuProfile(opts: { username: string }) {
    const { data } = await this.osuApi.get<OsuResponse[]>("/get_user", {
      params: { u: opts.username },
    });

    return data;
  }

  public async getUrbanResult(opts: { search: string }) {
    const { data } = await this.urbanApi.get<UrbanResult>("/v0/define", {
      params: { term: opts.search },
    });

    return data;
  }

  public async getWikipediaSearch(opts: { query: string }) {
    const { data } = await this.wikipediaApi.get<WikipediaResponse>("/", {
      params: { srsearch: opts.query },
    });

    return data;
  }

  public async getStock(opts: { tickerSymbol: string }) {
    const { data } = await this.stockAPI.get<StockResult>(
      `/quote/${encodeURI(opts.tickerSymbol)}/info`,
      { params: { assetclass: "stocks" } },
    );

    return data.data;
  }

  public async getWeather(opts: { query: string }) {
    const { data } = await this.weatherAPI.get<WeatherResponse>("/", {
      params: { q: opts.query },
    });

    return data;
  }

  public async getBoredActivity() {
    const { data } = await this.boredApi.get<BoredActivityResponse>("/");

    return data;
  }

  public async getHolidays(params: { countryISO: string }) {
    const currentYear = new Date().getUTCFullYear();
    try {
      const { data } = await this.holidaysApi.get<HolidayResponse>(
        `/${currentYear}/${params.countryISO}`,
      );

      return data;
    } catch (e) {
      return null;
    }
  }

  public async getNameAgify(params: { name: string }) {
    const { data } = await this.agifyApi.get<AgifyResponse>("/", {
      params: { name: params.name },
    });

    return data;
  }
}
