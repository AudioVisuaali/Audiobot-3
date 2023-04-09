import { validateFormatMessageKey } from "../translations/formatter";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

class PingCommand extends AbstractCommand {
  public async execute() {
    await this.message.channel.send(this.formatMessage("commandPingReply"));
  }
}

export const pingCommand: Command = {
  emoji: "🏓",
  name: validateFormatMessageKey("commandPingMetaName"),
  description: validateFormatMessageKey("commandPingMetaDescription"),
  command: "ping",
  aliases: ["pong"],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new PingCommand(payload);
  },
};
