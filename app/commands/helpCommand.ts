import { Command } from "discord.js";

export const helpCommand: Command = {
  name: "Help",
  command: "Help",
  aliases: ["heelp"],
  description: "Help menu",
  execute(message) {
    message.channel.send("Help");
  },
};
