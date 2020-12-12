import { Command } from "discord.js";

export const pingCommand: Command = {
  name: "Ping",
  command: "ping",
  aliases: ["pong"],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Ping!",

  execute(message) {
    message.channel.send("Pong");
  },
};
