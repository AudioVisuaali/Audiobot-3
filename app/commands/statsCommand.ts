import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";
import { timeUtils } from "~/utils/timeUtils";

export const statsCommand: Command = {
  emoji: "🔧",
  name: "Stats",
  command: "stats",
  aliases: [],
  syntax: "",
  examples: [],
  isAdmin: false,
  description: "Gives the status of the bot",

  async execute(message, _, { dataSources }) {
    const data = message.client.user
      ? await dataSources.botInfoDS.getBotInfo({
          discordBotId: message.client.user?.id,
        })
      : null;

    const uptimeObject = timeUtils.getDurationFromMS({
      ms: message.client.uptime || 0,
    });

    const uptimeString = timeUtils.durationObjectToString(uptimeObject);

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle("🔧 Bot status")
      .setDescription(`Bot has been on for ${uptimeString}`)
      .addField("Restart count", data ? data.restarts : 0);

    await message.channel.send(embed);
  },
};
