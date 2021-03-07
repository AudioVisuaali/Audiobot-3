import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class TokensCommand extends AbstractCommand {
  async execute() {
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
  name: "Tokens",
  command: "tokens",
  aliases: [],
  syntax: "<query>",
  examples: ["book"],
  isAdmin: false,
  description: "Your tokens currently",

  getCommand(payload) {
    return new TokensCommand(payload);
  },
};
