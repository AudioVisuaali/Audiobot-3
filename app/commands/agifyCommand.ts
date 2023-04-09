import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class AgifyCommand extends AbstractCommand {
  public async execute() {
    if (this.args.length === 0) {
      return await this.sendNoName();
    }

    if (this.args[0].length === 0) {
      return await this.sendNoName();
    }

    const name = await this.services.stats.getNameAgify({
      name: this.args[0],
    });

    if (!name.age) {
      return await this.sendNoName();
    }

    const nameFormatted = responseUtils.capitalizeFirstLetter({
      name: name.name,
    });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(
        this.formatMessage("commandAgifyTitle", {
          name: nameFormatted,
          age: name.age,
        }),
      );

    await this.message.channel.send({ embeds: [embed] });
  }

  private async sendNoName() {
    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandAgifyProvideName"));

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const agifyCommand: Command = {
  emoji: "🔞",
  name: validateFormatMessageKey("commandAgifyMetaName"),
  description: validateFormatMessageKey("commandAgifyMetaDescription"),
  command: "agify",
  aliases: [],
  syntax: "<name>",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new AgifyCommand(payload);
  },
};
