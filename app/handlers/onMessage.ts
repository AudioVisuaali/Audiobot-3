import { Message } from "discord.js";

import { modules } from "~/commands/commands";
import { Context } from "~/context";
import { inputUtils } from "~/utils/inputUtils";

export type HandleMessage = (
  context: Context,
) => (message: Message) => Promise<void>;

export const handleMessage: HandleMessage = (context) => async (message) => {
  if (!message.guild) {
    return;
  }

  if (message.author.bot) {
    return;
  }

  if (message.channel.type === "dm") {
    return;
  }

  context.logger.info("User sent message", {
    authorId: message.author.id,
    authorName: message.author.username,
    authorDiscriminator: message.author.discriminator,
    message: message.content,
  });

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
  });

  const [commandName, ...args] = inputUtils.getMessageCommandAndArgs({
    message,
    prefix,
  });

  const commandModule = modules.find(
    (command) =>
      command.command === commandName || command.aliases.includes(commandName),
  );

  if (!commandModule) {
    return;
  }
  commandModule.execute(message, args, context);
};
