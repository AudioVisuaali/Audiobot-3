import { validateFormatMessageKey } from "../translations/formatter";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class WikipediaCommand extends AbstractCommand {
  public async execute() {
    await this.message.channel.send("Not ready :)");
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
