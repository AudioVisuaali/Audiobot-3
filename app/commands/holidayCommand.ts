import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { validateFormatMessageKey } from "~/translations/formatter";
import { responseUtils } from "~/utils/responseUtils";

class HolidayCommand extends AbstractCommand {
  public async execute() {
    const countryISO = this.args.length ? this.args[0] ?? "US" : "US";
    const holidays = await this.services.stats.getHolidays({ countryISO });

    if (!holidays) {
      const embed = responseUtils
        .positive({ discordUser: this.message.author })
        .setTitle(this.formatMessage("commandHolidayInvalidCountry"));

      await this.message.channel.send(embed);

      return;
    }

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandHolidayTitle"))
      .addFields(
        holidays.map((holiday) => ({
          name: holiday.localName,
          value: holiday.date,
          inline: true,
        })),
      );

    await this.message.channel.send(embed);
  }
}

export const holidayCommand: Command = {
  emoji: "📅",
  name: validateFormatMessageKey("commandHolidayMetaName"),
  description: validateFormatMessageKey("commandHolidayMetaDescription"),
  command: "holidays",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,

  getCommand(payload) {
    return new HolidayCommand(payload);
  },
};
