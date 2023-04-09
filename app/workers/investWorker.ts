import { Client } from "discord.js";
import { DateTime } from "luxon";

import { Context } from "../context";
import { timeUtils } from "../utils/timeUtils";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const investWorker = async (opts: {
  client: Client;
  context: Context;
}) => {
  while (true) {
    const now = DateTime.utc();
    const nextCompoundAt = timeUtils.getNextCompoundAt();

    const nextCompoundInMS = timeUtils.msBetweenDates(now, nextCompoundAt);
    const nextCompoundInHuman = timeUtils.humanReadableTimeBetweenDates(
      now,
      nextCompoundAt,
    );

    opts.context.logger.info(
      `Timeout for compounding ${nextCompoundInMS}ms`,
      nextCompoundInHuman,
    );
    await sleep(nextCompoundInMS);

    await opts.context.dataSources.userDS.updateStockFields();
  }
};
