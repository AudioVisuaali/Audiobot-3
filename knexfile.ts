import { config } from "dotenv";

import { getConfigFromEnv } from "./app/config";
import { getConnection } from "./app/database/connection";

// This file is for knex migrations

config();

const envConfig = getConfigFromEnv();

module.exports = getConnection({ config: envConfig });
