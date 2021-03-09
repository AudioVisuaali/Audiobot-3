import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

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

    await this.message.channel.send(embed);
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
