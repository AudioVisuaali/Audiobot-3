import axios, { AxiosInstance } from "axios";

import { CreateServiceOptions, ServiceWithContext } from "./ServiceWithContext";

type YoMamaApiResponse = {
  joke: string;
};

type ChuckNorrisApiResponse = {
  type: string;
  value: {
    id: number;
    joke: string;
    categories: unknown[];
  };
};

type DadApiResponse = {
  attachments: [
    {
      fallback: string;
      footer: string;
      text: string;
    },
  ];
  // eslint-disable-next-line camelcase
  response_type: string;
  username: string;
};

type PunResponse = {
  Pun: string;
};

export class JokesService extends ServiceWithContext {
  protected yomamaApi: AxiosInstance;
  protected dadApi: AxiosInstance;
  protected chuckNorrisApi: AxiosInstance;
  protected punApi: AxiosInstance;

  constructor(opts: CreateServiceOptions) {
    super(opts);
    this.yomamaApi = axios.create({ baseURL: "http://api.yomomma.info/" });
    this.chuckNorrisApi = axios.create({ baseURL: "http://api.icndb.com/" });
    this.dadApi = axios.create({ baseURL: "https://icanhazdadjoke.com/" });
    this.punApi = axios.create({
      baseURL: "http://getpuns.herokuapp.com/api/random",
    });
  }

  public async getYoMamaJoke() {
    const { data } = await this.yomamaApi.get<YoMamaApiResponse>("");

    return data.joke;
  }

  public async getDadJoke() {
    const { data } = await this.dadApi.get<DadApiResponse>("/slack");

    return data;
  }

  public async getChuckNorrisJoke() {
    const { data } = await this.chuckNorrisApi.get<ChuckNorrisApiResponse>(
      "/jokes/random",
    );

    return data;
  }

  public async getPun() {
    const { data } = await this.punApi.get<PunResponse>("/");

    return data;
  }
}
