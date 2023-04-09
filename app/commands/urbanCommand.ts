import { validateFormatMessageKey } from "../translations/formatter";
import { responseUtils } from "../utils/responseUtils";

import { AbstractCommand } from "./AbstractCommand";
import { Command } from "./commands";

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
      .setAuthor({
        name: query,
        iconURL: urbanLogo,
        url: first.permalink,
      })
      .setDescription(first.definition)
      .setThumbnail(urbanLogo)
      .addFields([
        {
          name: this.formatMessage("commandUrbanFieldExample"),
          value: first.example,
          inline: true,
        },
        {
          name: ":thumbsup:",
          value: first.thumbs_up.toString(),
          inline: true,
        },
        {
          name: ":thumbsdown:",
          value: first.thumbs_down.toString(),
          inline: true,
        },
      ]);

    await this.message.channel.send({ embeds: [embed] });
  }
}

export const urbanCommand: Command = {
  emoji: "📚",
  name: validateFormatMessageKey("commandUrbanMetaName"),
  description: validateFormatMessageKey("commandUrbanMetaDescription"),
  command: "urban",
  aliases: ["urbandictionary", "dictionary"],
  syntax: "<query>",
  examples: ["car"],
  isAdmin: false,

  getCommand(payload) {
    return new UrbanCommand(payload);
  },
};
