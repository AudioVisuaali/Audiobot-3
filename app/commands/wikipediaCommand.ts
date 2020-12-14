import { Command } from "~/commands/commands";

export const wikipediaCommand: Command = {
  name: "Wikipedia",
  command: "wikipedia",
  aliases: ["wiki", "pedia"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Search on wikipedia",

  execute(message) {
    message.channel.send("Pong");
  },
};
