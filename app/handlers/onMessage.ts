import { Guild, Message } from "discord.js";

import { commands } from "~/commands/commands";
import { Context } from "~/context";
import {
  FormatMessageFunction,
  formatMessageSetLocale,
  Locales,
} from "~/translations/formatter";
import { inputUtils } from "~/utils/inputUtils";

const formatMessageBody = (opts: { message: Message }) => ({
  authorId: opts.message.author.id,
  authorName: opts.message.author.username,
  authorDiscriminator: opts.message.author.discriminator,
  message: opts.message.content,
});

export interface CustomMessage extends Message {
  guild: Guild;
}

export type ContextWithTranslation = Context & {
  formatMessage: FormatMessageFunction;
};

export type CommandPayload = {
  message: CustomMessage;
  args: string[];
  context: ContextWithTranslation;
};

const handleMessageWorker = async (opts: {
  message: Message;
  context: Context;
}) => {
  // Checks for guild
  const message = opts.message as CustomMessage;
  const { context } = opts;
  context.logger.info("Regular message received");

  if (!message.guild) {
    return context.logger.info(
      "message without guild",
      formatMessageBody({ message }),
    );
  }

  if (message.author.bot) {
    return context.logger.warn("Bot messaged", formatMessageBody({ message }));
  }

  if (message.channel.type === "dm") {
    return context.logger.warn(
      "User tried to send a dm message",
      formatMessageBody({ message }),
    );
  }

  const isUserTimedOut = context.services.timeout.isUserTimedOut({
    userDiscordId: message.author.id,
  });

  if (isUserTimedOut) {
    return;
  }

  const { prefix } = await context.dataSources.guildDS.verifyGuild({
    guildDiscordId: message.guild.id,
  });

  if (!message.content.startsWith(prefix)) {
    return;
  }

  await context.dataSources.userDS.verifyUser({
    userDiscordId: message.author.id,
    guildDiscordId: message.guild.id,
  });

  const [commandName, ...args] = inputUtils.getMessageCommandAndArgs({
    message,
    prefix,
  });

  const commandModule = commands.find(
    (command) =>
      command.command === commandName || command.aliases.includes(commandName),
  );

  if (!commandModule) {
    return context.logger.info(
      "User tried invoked a command with invalid moduleName",
      { ...formatMessageBody({ message }), commandName: commandName },
    );
  }

  context.logger.info("User invoked a command", {
    ...formatMessageBody({ message }),
    module: commandModule.name,
  });

  const commandClass = commandModule.getCommand({
    message,
    args,
    context: {
      ...context,
      formatMessage: formatMessageSetLocale(Locales.En),
    },
  });

  await commandClass.execute();
};

export type HandleMessage = (opts: {
  context: Context;
}) => (message: Message) => Promise<void>;

export const handleMessage: HandleMessage = ({ context }) => async (
  message: Message,
) => {
  try {
    await handleMessageWorker({ context, message });
  } catch (error) {
    context.logger.error("Command error", error);
  }
};
