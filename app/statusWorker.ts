import { Client } from "discord.js";

import { Utils } from "./utils/utils";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const statusWorker = async (opts: { client: Client; utils: Utils }) => {
  while (true) {
    const { usersCount } = opts.utils.statusUtils.getTotalServersAndUsers({
      client: opts.client,
    });

    opts.client.user?.setActivity(`Serving ${usersCount} users`);
    await sleep(10000);
  }
};
