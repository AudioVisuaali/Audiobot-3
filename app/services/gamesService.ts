import axios, { AxiosInstance } from "axios";

import { CreateServiceOptions, ServiceWithContext } from "./ServiceWithContext";

export enum TriviaType {
  Boolean = "boolean",
  Multiple = "multiple",
}

export enum TriviaDifficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export type Trivia = {
  category: string;
  type: TriviaType;
  difficulty: TriviaDifficulty;
  question: string;
  // eslint-disable-next-line camelcase
  correct_answer: string;
  // eslint-disable-next-line camelcase
  incorrect_answers: string[];
};

type TriviaResponse = {
  // eslint-disable-next-line camelcase
  response_code: number;
  results: Trivia[];
};

export class GamesService extends ServiceWithContext {
  protected triviaApi: AxiosInstance;

  constructor(opts: CreateServiceOptions) {
    super(opts);
    this.triviaApi = axios.create({
      baseURL: "https://opentdb.com/api.php",
      params: { amount: 1 },
    });
  }

  public async getTrivia() {
    const { data } = await this.triviaApi.get<TriviaResponse>("/");

    return data;
  }
}
