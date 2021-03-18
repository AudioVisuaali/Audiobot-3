import bunyan from "bunyan";

import { Config } from "~/config";

export const createLogger = (opts: { config: Config }) =>
  bunyan.createLogger({
    name: "discord-bot",
    streams: [
      ...(opts.config.env.stdoutLogging
        ? [{ level: "info" as const, stream: process.stdout }]
        : []),
      ...(opts.config.env.isFileLogging
        ? [{ level: "warn" as const, path: "./logs/logs.json" }]
        : []),
    ],
  });
