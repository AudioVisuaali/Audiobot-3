import { Command } from "discord.js";

import { modules } from "./commands";

export const helpCommand: Command = {
  name: "Help",
  command: "help",
  aliases: ["heelp"],
  description: "Help menu",

  execute(message) {
    const commands = modules.map((command) => command.command);

    message.channel.send(commands);
  },
};
