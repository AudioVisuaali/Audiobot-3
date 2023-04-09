import { ChannelType, Guild, Message } from "discord.js";

import { getCommand } from "../commands/commands";
import { Context } from "../context";
import {
  FormatMessageFunction,
  defaultLanguage,
  formatMessageSetLocale,
} from "../translations/formatter";
import { inputUtils } from "../utils/inputUtils";

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
  const message = opts.message as CustomMessage;
  const { context } = opts;

  if (!message.guild) {
    return context.logger.warn(
      "message without guild",
      formatMessageBody({ message }),
    );
  }

  if (message.author.bot) {
    return context.logger.warn("Bot messaged", formatMessageBody({ message }));
  }

  if (message.channel.type === ChannelType.DM) {
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

  const { prefix, language } = await context.dataSources.guildDS.verifyGuild({
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

  const commandModule = getCommand({ name: commandName });

  if (!commandModule) {
    return context.logger.debug(
      "User tried invoked a command with invalid moduleName",
      { ...formatMessageBody({ message }), commandName: commandName },
    );
  }

  context.logger.info("Command invoked", {
    ...formatMessageBody({ message }),
    module: commandModule.name,
  });

  const formatMessage = formatMessageSetLocale(language ?? defaultLanguage);

  const commandClass = commandModule.getCommand({
    message,
    args,
    context: { ...context, formatMessage },
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
