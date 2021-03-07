import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

const spongebob =
  "https://en.meming.world/images/en/thumb/e/e0/Mocking_SpongeBob.jpg/300px-Mocking_SpongeBob.jpg";

class SpongeBobCommand extends AbstractCommand {
  public async execute() {
    const letter = this.args
      .join(" ")
      .split("")
      .map((character, index) =>
        index % 2 === 0
          ? character.toLocaleLowerCase()
          : character.toLocaleUpperCase(),
      )
      .join("");

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setThumbnail(spongebob)
      .setDescription(letter);

    await this.message.channel.send(embed);
  }
}

export const spongebobCommand: Command = {
  emoji: "🧽",
  name: "Spongebob",
  command: "sponbebob",
  aliases: ["retarded"],
  syntax: "<text>",
  examples: ["anything goes here"],
  isAdmin: false,
  description: "Spongebob styled text",

  getCommand(payload) {
    return new SpongeBobCommand(payload);
  },
};
