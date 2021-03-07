import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";

class WikipediaCommand extends AbstractCommand {
  public async execute() {
    await this.message.channel.send("Pong");
  }
}

export const wikipediaCommand: Command = {
  emoji: "🌐",
  name: "Wikipedia",
  command: "wikipedia",
  aliases: ["wiki", "pedia"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Search on wikipedia",

  getCommand(payload) {
    return new WikipediaCommand(payload);
  },
};
