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

export const getDatabaseConfigFromEnv = () => ({
  type: requireEnv("DATABASE_TYPE"),
  host: requireEnv("DATABASE_HOST"),
  user: requireEnv("DATABASE_USER"),
  port: requireIntEnv("DATABASE_PORT"),
  password: requireEnv("DATABASE_PASSWORD"),
  name: requireEnv("DATABASE_DATABASE_NAME"),
});

export type ConfigDatabase = ReturnType<typeof getDatabaseConfigFromEnv>;

export const getConfigFromEnv = () => ({
  env: {
    stdoutLogging: requireBoolean("STDOUT_LOGGING"),
    isFileLogging: requireBoolean("FILE_LOGGING"),
    isProduction: requireBoolean("PRODUCTION"),
  },

  bot: {
    discordAPIKey: requireEnv("DISCORD_API_KEY"),
    commandPrefixDefault: requireEnv("DISCORD_COMMAND_PREFIX_DEFAULT"),
  },

  apiKeys: {
    google: requireEnv("GOOGLE_API_KEY"),
    osu: requireEnv("OSU_API_KEY"),
    weather: requireEnv("WEATHER_API"),
  },

  database: getDatabaseConfigFromEnv(),
});

export type Config = ReturnType<typeof getConfigFromEnv>;
