import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

export const osuCommand: Command = {
  emoji: "🔴",
  name: "Osu",
  command: "osu",
  aliases: [],
  syntax: "<username>",
  examples: ["username"],
  isAdmin: false,
  description: "Get user information from Osu",

  async execute(message, args, { services }) {
    const username = args.join(" ");
    const [user] = await services.stats.getOsuProfile({ username });

    if (!user) {
      const embed = responseUtils
        .negative({ discordUser: message.author })
        .setTitle("Osu")
        .setDescription(`User not found **${username}**`);

      return message.channel.send(embed);
    }

    const embed = responseUtils
      .positive({ discordUser: message.author })
      .setTitle(user.username)
      .setDescription(`Osu stats for user ${user.username}`)
      .addField("PP", user.pp_raw, true)
      .addField("Level", user.level, true)
      .addField("Global rank", user.pp_rank, true)
      .addField("Country rank", user.pp_country_rank, true)
      .addField("Country", user.country, true)
      .addField("Accuracy", user.accuracy, true)
      .addField("Ranked Score", user.ranked_score, true)
      .addField("Total Score", user.total_score, true)
      .addField("Play count", user.playcount, true)
      .addField(
        "SSH / SS / SH / S / A / 300 / 100 / 50",
        [
          user.count_rank_ssh,
          user.count_rank_ss,
          user.count_rank_sh,
          user.count_rank_s,
          user.count_rank_a,
          user.count300,
          user.count100,
          user.count50,
        ].join(" / "),
      );

    message.channel.send(embed);
  },
};
