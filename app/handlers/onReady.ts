import { Client } from "discord.js";

import { Context } from "~/context";
import { investWorker } from "~/workers/investWorker";
import { statusWorker } from "~/workers/statusWorker";

export const handleOnReady = (opts: {
  client: Client;
  context: Context;
}) => async () => {
  const { client, context } = opts;
  const { user } = opts.client;

  if (!user) {
    return opts.context.logger.error("No user provided on connection");
  }

  opts.context.logger.info(`Logged in as: ${user.tag}!`);
  opts.context.logger.info(`Client ID: ${user.id}!`);
  opts.context.logger.info("Listening to the chat!");

  const botInfo = await opts.context.dataSources.botInfoDS.verifyBotInfo({
    discordBotId: user.id,
  });

  await opts.context.dataSources.botInfoDS.modifyBotInfo({
    discordBotId: botInfo.discordBotId,
    modifyRestarts: 1,
  });

  investWorker({ client, context });
  statusWorker({ client, logger: context.logger });
};
