import Logger from "bunyan";

import { DataSources } from "~/dataSources/dataSources";
import { CommandPayload, CustomMessage } from "~/handlers/onMessage";
import { Services } from "~/services/services";
import { FormatMessageFunction } from "~/translations/formatter";

export abstract class AbstractCommand {
  message: CustomMessage;
  args: string[];
  formatMessage: FormatMessageFunction;
  logger: Logger;
  services: Services;
  dataSources: DataSources;

  constructor(payload: CommandPayload) {
    this.message = payload.message;
    this.args = payload.args;
    this.formatMessage = payload.context.formatMessage;
    this.logger = payload.context.logger;
    this.services = payload.context.services;
    this.dataSources = payload.context.dataSources;
  }

  public abstract execute(): Promise<unknown>;
}
