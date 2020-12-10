import { getConfigFromEnv } from "~/config";
import { createServer } from "~/server";

const config = getConfigFromEnv();

createServer({ config }).login(config.discordAPIKey);
