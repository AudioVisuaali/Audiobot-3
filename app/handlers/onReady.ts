import { Client } from "discord.js";

import { Context } from "../context";
import { statusUtils } from "../utils/statusUtils";
import { investWorker } from "../workers/investWorker";
import { statusWorker } from "../workers/statusWorker";

export const handleOnReady = (opts: {
  client: Client;
  context: Context;
}) => async () => {
  const { client, context } = opts;
  const { user } = opts.client;

  if (!user) {
    return opts.context.logger.error("No user provided on connection");
  }

  const usageData = statusUtils.getTotalServersAndUsers({
    client: opts.client,
  });

  opts.context.logger.info(`Logged in as: ${user.tag}!`);
  opts.context.logger.info(`Client ID: ${user.id}!`);
  opts.context.logger.info("Listening to the chat!");
  opts.context.logger.info("Currently serving", usageData);

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
