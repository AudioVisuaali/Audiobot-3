import axios, { AxiosInstance } from "axios";

import {
  CreateServiceOptions,
  ServiceWithContext,
} from "~/services/ServiceWithContext";

type CatFactResponse = {
  fact: string;
  length: number;
};

type CatPictureResponse = {
  file: string;
};

type DogPictureResponse = {
  fileSizeBytes: number;
  url: string;
};

type DogFactResponse = {
  facts: [string];
  success: boolean;
};

export class AnimalService extends ServiceWithContext {
  protected catfactApi: AxiosInstance;
  protected catPictureApi: AxiosInstance;

  protected dogfactApi: AxiosInstance;
  protected dogPictureApi: AxiosInstance;

  constructor(opts: CreateServiceOptions) {
    super(opts);
    this.catfactApi = axios.create({ baseURL: "https://catfact.ninja/" });
    this.catPictureApi = axios.create({ baseURL: "http://aws.random.cat/" });

    this.dogfactApi = axios.create({
      baseURL: "http://dog-api.kinduff.com/api",
    });
    this.dogPictureApi = axios.create({ baseURL: "https://random.dog/" });
  }

  public async getCatFact() {
    const { data } = await this.catfactApi.get<CatFactResponse>("/fact");

    return data;
  }

  public async getCatPicture() {
    const { data } = await this.catPictureApi.get<CatPictureResponse>("/meow");

    return data;
  }

  public async getDogFact() {
    const { data } = await this.dogfactApi.get<DogFactResponse>("/facts");

    return data;
  }

  public async getDogPicture() {
    const { data } = await this.dogPictureApi.get<DogPictureResponse>(
      "/woof.json",
    );

    return data;
  }
}
