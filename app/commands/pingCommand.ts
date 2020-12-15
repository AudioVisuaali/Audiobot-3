import { Command } from "~/commands/commands";

export const pingCommand: Command = {
  emoji: "🏓",
  name: "Ping",
  command: "ping",
  aliases: ["pong"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Ping!",

  async execute(message) {
    message.channel.send("🏓 Pong");
  },
};
