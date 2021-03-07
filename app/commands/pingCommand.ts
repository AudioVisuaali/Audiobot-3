import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";

class PingCommand extends AbstractCommand {
  public async execute() {
    await this.message.channel.send(this.formatMessage("commandPingReply"));
  }
}

export const pingCommand: Command = {
  emoji: "🏓",
  name: "Ping",
  command: "ping",
  aliases: ["pong"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Ping!",

  getCommand(payload) {
    return new PingCommand(payload);
  },
};
