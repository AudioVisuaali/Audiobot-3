import { Client } from "discord.js";

import { statusUtils } from "~/utils/statusUtils";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const statusWorker = async (opts: { client: Client }) => {
  while (true) {
    const { usersCount } = statusUtils.getTotalServersAndUsers({
      client: opts.client,
    });

    opts.client.user?.setActivity(`Serving ${usersCount} users`);
    await sleep(10000);
  }
};
