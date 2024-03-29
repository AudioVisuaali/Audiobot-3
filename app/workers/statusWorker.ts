import Logger from "bunyan";
import { Client } from "discord.js";

import { statusUtils } from "../utils/statusUtils";
import { timeUtils } from "../utils/timeUtils";

export const statusWorker = async (opts: {
  client: Client;
  logger: Logger;
}) => {
  while (true) {
    const { usersCount, serversCount } = statusUtils.getTotalServersAndUsers({
      client: opts.client,
    });

    opts.client.user?.setActivity(
      `Serving ${usersCount} users on ${serversCount} servers`,
    );
    opts.logger.info("Updated bot status");
    await timeUtils.sleep(60000);
  }
};
