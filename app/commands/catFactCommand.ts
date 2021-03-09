import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class CatFactCommand extends AbstractCommand {
  public async execute() {
    const catfact = await this.services.animal.getCatFact();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandCatFactTitle"))
      .setDescription(catfact.fact);

    await this.message.channel.send(embed);
  }
}

export const catFactCommand: Command = {
  emoji: "🐱",
  name: validateFormatMessageKey("commandCatFactMetaName"),
  command: "catfact",
  aliases: ["catf"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: validateFormatMessageKey("commandCatFactMetaDescription"),

  getCommand(payload) {
    return new CatFactCommand(payload);
  },
};
