import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";

class WikipediaCommand extends AbstractCommand {
  public async execute() {
    await this.message.channel.send("Pong");
  }
}

export const wikipediaCommand: Command = {
  emoji: "🌐",
  name: validateFormatMessageKey("commandWikipediaMetaName"),
  description: validateFormatMessageKey("commandWikipediaMetaDescription"),
  command: "wikipedia",
  aliases: ["wiki", "pedia"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new WikipediaCommand(payload);
  },
};
