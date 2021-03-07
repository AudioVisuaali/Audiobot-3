import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
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
        .setDescription("You need to provide options");

      return await this.message.channel.send(embed);
    }

    const position = mathUtils.getRandomArbitrary(0, options.length - 1);

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(`❓ I choose ${options[position]}`);

    await this.message.channel.send(embed);
  }
}

export const chooseCommand: Command = {
  emoji: "❓",
  name: "Choose Option",
  command: "choose",
  aliases: ["option"],
  syntax: "[<option>]",
  examples: ["car | house | flower"],
  isAdmin: false,
  description: "Choose a random option",

  getCommand(payload) {
    return new ChooseCommand(payload);
  },
};
