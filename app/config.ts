/* eslint-disable no-process-env */

const requireEnv = (env: string): string => {
  const envVariable = process.env[env];

  if (!envVariable) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  return envVariable;
};

const requireIntEnv = (env: string): number => {
  const envValue = process.env[env];

  if (!envValue) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  const parsed = parseInt(envValue, 10);

  if (!parsed || isNaN(parsed)) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  return parsed;
};

const requireBoolean = (env: string): boolean => {
  const envValue = process.env[env];

  if (!envValue) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  if (envValue === "TRUE") {
    return true;
  }

  if (envValue === "FALSE") {
    return false;
  }

  throw new Error(
    `Environment variable ${env} only accepts 'TRUE' or 'FALSE'!`,
  );
};

export const getConfigFromEnv = () => ({
  stdoutLogging: requireBoolean("STDOUT_LOGGING"),
  isProduction: requireBoolean("PRODUCTION"),

  discordAPIKey: requireEnv("DISCORD_API_KEY"),
  discordCommandPrefixDefault: requireEnv("DISCORD_COMMAND_PREFIX_DEFAULT"),

  googleAPIKey: requireEnv("GOOGLE_API_KEY"),
  osuApiKey: requireEnv("OSU_API_KEY"),
  weatherAPI: requireEnv("WEATHER_API"),

  databaseType: requireEnv("DATABASE_TYPE"),
  databaseHost: requireEnv("DATABASE_HOST"),
  databaseUser: requireEnv("DATABASE_USER"),
  databasePort: requireIntEnv("DATABASE_PORT"),
  databasePassword: requireEnv("DATABASE_PASSWORD"),
  databaseDatabaseName: requireEnv("DATABASE_DATABASE_NAME"),
});

export type Config = ReturnType<typeof getConfigFromEnv>;
