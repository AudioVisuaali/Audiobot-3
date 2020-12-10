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

export class StatsService extends ServiceWithContext {
  protected genderApi: AxiosInstance;
  protected numberFactApi: AxiosInstance;
  protected osuApi: AxiosInstance;
  protected urbanApi: AxiosInstance;

  constructor(opts: CreateServiceOptions) {
    super(opts);
    this.genderApi = axios.create({ baseURL: "https://api.genderize.io/" });
    this.numberFactApi = axios.create({ baseURL: "http://numbersapi.com/" });
    this.osuApi = axios.create({
      baseURL: "https://osu.ppy.sh/api/v1/",
      params: { k: opts.config.osuApiKey },
    });
    this.urbanApi = axios.create({
      baseURL: "http://api.urbandictionary.com/",
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
    const { data } = await this.osuApi.get("/", {
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
}
