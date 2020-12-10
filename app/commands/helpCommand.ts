import { Command } from "discord.js";

export const helpCommand: Command = {
  name: "Help",
  command: "help",
  aliases: ["heelp"],
  description: "Help menu",

  execute(message) {
    message.channel.send("Help");
  },
};
