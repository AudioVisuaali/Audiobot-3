import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class PunCommand extends AbstractCommand {
  public async execute() {
    const pun = await this.services.jokes.getPun();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(pun.Pun);

    await this.message.channel.send(embed);
  }
}

export const punCommand: Command = {
  emoji: "✊",
  name: "Puns",
  command: "pun",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Get a random pun",

  getCommand(payload) {
    return new PunCommand(payload);
  },
};
