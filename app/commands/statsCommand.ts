import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

class StatsCommand extends AbstractCommand {
  private getUptimeString() {
    const uptimeObject = timeUtils.getDurationFromMS({
      ms: this.message.client.uptime || 0,
    });

    return timeUtils.durationObjectToString(uptimeObject);
  }

  private async getBotInfo() {
    if (this.message.client.user) {
      return await this.dataSources.botInfoDS.getBotInfo({
        discordBotId: this.message.client.user?.id,
      });
    }

    return null;
  }

  public async execute() {
    const data = await this.getBotInfo();

    const uptimeString = this.getUptimeString();

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(this.formatMessage("commandStatsTitle"))
      .setDescription(
        this.formatMessage("commandStatsDescription", { uptime: uptimeString }),
      )
      .addField(
        this.formatMessage("commandStatsFieldRestartCount"),
        data ? data.restarts : 0,
      );

    await this.message.channel.send(embed);
  }
}

export const statsCommand: Command = {
  emoji: "🔧",
  name: "Stats",
  command: "stats",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Gives the status of the bot",

  getCommand(payload) {
    return new StatsCommand(payload);
  },
};
