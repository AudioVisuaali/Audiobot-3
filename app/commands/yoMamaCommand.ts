import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class YoMamaCommand extends AbstractCommand {
  public async execute() {
    const joke = await this.services.jokes.getYoMamaJoke();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setDescription(joke);

    await this.message.channel.send(embed);
  }
}

export const yoMamaCommand: Command = {
  emoji: "👩",
  name: "Yo mama",
  command: "yomama",
  aliases: ["mama"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Yo mama so fat",

  getCommand(payload) {
    return new YoMamaCommand(payload);
  },
};
