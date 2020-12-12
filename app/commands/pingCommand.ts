import { Command } from "discord.js";

export const pingCommand: Command = {
  name: "Ping",
  command: "ping",
  aliases: ["pong"],
  description: "Ping!",

  execute(message) {
    message.channel.send("Pong");
  },
};
