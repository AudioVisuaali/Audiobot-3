import axios, { AxiosInstance } from "axios";

import { CreateServiceOptions, ServiceWithContext } from "./ServiceWithContext";

// import eightBallResponses from "../maps/8ball.json";
// import jokes from "../maps/jokes.json";
// import lennyFaces from "../maps/lennyFaces.json";

export enum BPICurrencyType {
  EUR = "EUR",
  GBP = "GBP",
  USD = "USD",
}

export type BPICurrency = {
  code: BPICurrencyType;
  description: string;
  rate: string;
  // eslint-disable-next-line camelcase
  rate_float: number;
  symbol: string;
};

type BitcoinApiResponse = {
  bpi: {
    EUR: BPICurrency;
    GBP: BPICurrency;
    USD: BPICurrency;
    [key: string]: BPICurrency;
  };
  chartName: string;
  disclaimer: string;
  time: {
    updated: string;
    updatedISO: string;
    updateduk: string;
  };
};

export class CurrencyService extends ServiceWithContext {
  protected bitcoinApi: AxiosInstance;

  constructor(opts: CreateServiceOptions) {
    super(opts);
    this.bitcoinApi = axios.create({
      baseURL: "https://api.coindesk.com/v1/bpi/",
    });
  }

  public async getBitcoinData() {
    const { data } = await this.bitcoinApi.get<BitcoinApiResponse>(
      "currentprice.json",
    );

    return data;
  }
}
