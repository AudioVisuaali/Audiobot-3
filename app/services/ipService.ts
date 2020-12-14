import axios, { AxiosInstance } from "axios";

import {
  CreateServiceOptions,
  ServiceWithContext,
} from "~/services/ServiceWithContext";

type IPResponse = {
  ip: string;
  hostname: string;
  anycast: boolean;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  readme: string;
};

export class IPService extends ServiceWithContext {
  protected ipInfoApi: AxiosInstance;

  constructor(opts: CreateServiceOptions) {
    super(opts);
    this.ipInfoApi = axios.create({ baseURL: "https://ipinfo.io/" });
  }

  protected getIpDataByIp(opts: { ip: string }) {
    return this.ipInfoApi.get<IPResponse>(`/${opts.ip}/json`);
  }

  public async getIpData(opts: { ip: string }) {
    const { data } = await this.getIpDataByIp({ ip: opts.ip });

    return data;
  }
}
