import Logger from "bunyan";
import { Client } from "discord.js";

import { statusUtils } from "~/utils/statusUtils";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const statusWorker = async (opts: {
  client: Client;
  logger: Logger;
}) => {
  while (true) {
    const { usersCount } = statusUtils.getTotalServersAndUsers({
      client: opts.client,
    });

    opts.client.user?.setActivity(`Serving ${usersCount} users`);
    opts.logger.info("Updated bot status");
    await sleep(10000);
  }
};
