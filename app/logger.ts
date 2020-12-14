import bunyan from "bunyan";

import { Config } from "~/config";

export const createLogger = (opts: { config: Config }) =>
  bunyan.createLogger({
    name: "discord-bot",
    streams: [
      ...(opts.config.stdoutLogging
        ? [{ level: "info" as const, stream: process.stdout }]
        : []),
      {
        level: "error",
        path: "./logs/error.json",
      },
      {
        level: "fatal",
        path: "./logs/fatal.json",
      },
      {
        level: "warn",
        path: "./logs/warn.json",
      },
    ],
  });
