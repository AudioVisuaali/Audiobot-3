import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

const urbanLogo =
  "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg";

class UrbanCommand extends AbstractCommand {
  public async execute() {
    const query = this.args.join(" ");

    const urbanData = await this.services.stats.getUrbanResult({
      search: query,
    });

    const [first] = urbanData.list;

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(query)
      .setAuthor(query, urbanLogo, first.permalink)
      .setDescription(first.definition)
      .setThumbnail(urbanLogo)
      .addField(
        this.formatMessage("commandUrbanFieldExample"),
        first.example,
        true,
      )
      .addField(":thumbsup:", first.thumbs_up, true)
      .addField(":thumbsdown:", first.thumbs_down, true);

    await this.message.channel.send(embed);
  }
}

export const urbanCommand: Command = {
  emoji: "📚",
  name: "Urban",
  command: "urban",
  aliases: ["urbandictionary", "dictionary"],
  syntax: "<query>",
  examples: ["car"],
  isAdmin: false,
  description: "Search on Urban dictionary",

  getCommand(payload) {
    return new UrbanCommand(payload);
  },
};
