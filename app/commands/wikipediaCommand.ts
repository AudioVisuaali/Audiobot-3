import { Command } from "~/commands/commands";

export const wikipediaCommand: Command = {
  emoji: "🌐",
  name: "Wikipedia",
  command: "wikipedia",
  aliases: ["wiki", "pedia"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Search on wikipedia",

  async execute(message) {
    message.channel.send("Pong");
  },
};
