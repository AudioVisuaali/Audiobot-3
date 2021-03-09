import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

class ChooseCommand extends AbstractCommand {
  private getOptions() {
    return this.args.join("").split("|");
  }

  public async execute() {
    const options = this.getOptions();

    if (options.length === 0) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setDescription(this.formatMessage("commandChooseProvideOptions"));

      return await this.message.channel.send(embed);
    }

    const position = mathUtils.getRandomArbitrary(0, options.length - 1);

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(
        this.formatMessage("commandChooseIChoose", {
          result: options[position],
        }),
      );

    await this.message.channel.send(embed);
  }
}

export const chooseCommand: Command = {
  emoji: "❓",
  name: validateFormatMessageKey("commandChooseMetaName"),
  command: "choose",
  aliases: ["option"],
  syntax: "[<option>]",
  examples: ["car | house | flower"],
  isAdmin: false,
  description: validateFormatMessageKey("commandChooseMetaDescription"),

  getCommand(payload) {
    return new ChooseCommand(payload);
  },
};
