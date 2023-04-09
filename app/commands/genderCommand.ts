import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class GenderCommand extends AbstractCommand {
  public async execute() {
    if (this.args.length === 0) {
      return;
    }

    const genderResponse = await this.services.stats.getGenderOfName({
      name: this.args[0],
    });

    if (!genderResponse.gender) {
      return await this.message.channel.send(
        this.formatMessage("commandGenderNoResult", {
          name: genderResponse.name,
        }),
      );
    }

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(
        this.formatMessage("commandGenderTitle", { name: genderResponse.name }),
      )
      .setDescription(
        this.formatMessage("commandGenderDescription", {
          propability: genderResponse.probability * 100,
          name: genderResponse.name,
          gender: genderResponse.gender,
        }),
      );

    return await this.message.channel.send({ embeds: [embed] });
  }
}

export const genderCommand: Command = {
  emoji: "⚧️",
  name: validateFormatMessageKey("commandGenderMetaName"),
  description: validateFormatMessageKey("commandGenderMetaDescription"),
  command: "gender",
  aliases: [],
  syntax: "<name>",
  examples: ["Alex", "Emma"],
  isAdmin: false,

  getCommand(payload) {
    return new GenderCommand(payload);
  },
};
