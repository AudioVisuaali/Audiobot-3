import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { mathUtils } from "~/utils/mathUtil";
import { responseUtils } from "~/utils/responseUtils";

class NumberFactCommand extends AbstractCommand {
  public async execute() {
    if (this.args.length === 0) {
      return this.message.channel.send(
        this.formatMessage("errorNoNumberWasProvided"),
      );
    }

    const number = mathUtils.parseStringToNumber(this.args[0]);

    if (number === null) {
      return this.message.channel.send(
        this.formatMessage("errorInvalidNumber"),
      );
    }

    const fact = await this.services.stats.getNumerFact({ number });

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandNumberFactTitle", { number }))
      .setDescription(fact);

    await this.message.channel.send(embed);
  }
}

export const numberfactCommand: Command = {
  emoji: "🔢",
  name: "NumberFact",
  command: "numberfact",
  aliases: ["number"],
  syntax: "<number>",
  examples: ["69"],
  isAdmin: false,
  description: "Get facts for numbers",

  getCommand(payload) {
    return new NumberFactCommand(payload);
  },
};
