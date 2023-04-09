import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class TokensCommand extends AbstractCommand {
  public async execute() {
    const user = await this.dataSources.userDS.tryGetUser({
      userDiscordId: this.message.author.id,
      guildDiscordId: this.message.guild.id,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(
        this.formatMessage("commandTokensTitle", { tokens: user.tokens }),
      );

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const tokensCommand: Command = {
  emoji: "🏆",
  name: validateFormatMessageKey("commandTokensMetaName"),
  description: validateFormatMessageKey("commandTokensMetaDescription"),
  command: "tokens",
  aliases: [],
  syntax: "<query>",
  examples: ["book"],
  isAdmin: false,

  getCommand(payload) {
    return new TokensCommand(payload);
  },
};
