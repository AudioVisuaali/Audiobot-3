import { getConfigFromEnv } from "~/config";
import { createServer } from "~/server";

const config = getConfigFromEnv();

const client = createServer({ config });

process.on("SIGINT", () => {
  client.destroy();
});

client.login(config.discordAPIKey);
