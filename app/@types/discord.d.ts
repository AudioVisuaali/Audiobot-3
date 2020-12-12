import { Message } from "discord.js";

import { Context } from "../context";

declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, Command>;
  }

  export interface Command {
    name: string;
    command: string;
    aliases: string[];
    description: string;
    syntax: string;
    examples: string[];
    isAdmin: boolean;
    execute: (message: Message, args: string[], context: Context) => SomeType; // Can be `Promise<SomeType>` if using async
  }
}
