import axios, { AxiosInstance } from "axios";

import { CreateServiceOptions, ServiceWithContext } from "./ServiceWithContext";

type GoogleSearchResponse = unknown;

export class GoogleService extends ServiceWithContext {
  protected googleSearchApi: AxiosInstance;

  constructor(opts: CreateServiceOptions) {
    super(opts);
    this.googleSearchApi = axios.create({
      baseURL: "https://www.googleapis.com/customsearch/v1",
      params: {
        key: opts.config.googleAPIKey,
        cx: "008050020608944106700:shzflckcpo4",
      },
    });
  }

  public async getGoogleSearchResults(opts: { searchTerm: string }) {
    const { data } = await this.googleSearchApi.get<GoogleSearchResponse>("/", {
      params: { q: opts.searchTerm },
    });

    return data;
  }
}
