import Discord from "discord.js";

import { setClientModules } from "./commands/commands";
import { Config } from "./config";
import { createContext } from "./context";
import { createDataSources } from "./dataSources/dataSources";
import { createKnex } from "./database/connection";
import { handleMessage } from "./discord";
import { createLogger } from "./logger";
import { createServices } from "./services/services";
import { investWorker } from "./workers/investWorker";
import { statusWorker } from "./workers/statusWorker";

export const createServer = ({ config }: { config: Config }) => {
  const logger = createLogger({ config });
  const knex = createKnex({ config });
  const services = createServices({ config, logger });
  const dataSources = createDataSources({ config, logger, knex });
  const context = createContext({
    logger,
    services,
    dataSources,
  });

  const client = new Discord.Client();
  client.commands = new Discord.Collection();

  setClientModules({ client });

  client.on("ready", () => {
    const { user } = client;

    if (!user) {
      return;
    }

    logger.info(`Logged in as: ${user.tag}!`);
    logger.info(`Client ID: ${user.id}!`);
    logger.info("Listening to the chat!");

    investWorker({ client, context });
    statusWorker({ client, logger });
  });

  client.on("error", (error) => {
    logger.error(error);
  });

  // eslint-disable-next-line max-statements
  client.on("message", handleMessage(context));

  return client;
};
