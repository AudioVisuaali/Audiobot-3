import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { responseUtils } from "~/utils/responseUtils";

class OsuCommand extends AbstractCommand {
  async execute() {
    const username = this.args.join(" ");
    const [user] = await this.services.stats.getOsuProfile({ username });

    if (!user) {
      const embed = responseUtils
        .negative({ discordUser: this.message.author })
        .setTitle("Osu")
        .setDescription(
          this.formatMessage("errorOsuUserNotFound", { username }),
        );

      return this.message.channel.send(embed);
    }

    const embed = responseUtils
      .positive({ discordUser: this.message.author })
      .setTitle(user.username)
      .setDescription(this.formatMessage("commandOsuDescription", { username }))
      .addField(this.formatMessage("commandOsuFieldPP"), user.pp_raw, true)
      .addField(this.formatMessage("commandOsuFieldLevel"), user.level, true)
      .addField(
        this.formatMessage("commandOsuFieldGlobalRank"),
        user.pp_rank,
        true,
      )
      .addField(
        this.formatMessage("commandOsuFieldCountryRank"),
        user.pp_country_rank,
        true,
      )
      .addField(
        this.formatMessage("commandOsuFieldCountry"),
        user.country,
        true,
      )
      .addField(
        this.formatMessage("commandOsuFieldAccuracy"),
        user.accuracy,
        true,
      )
      .addField(
        this.formatMessage("commandOsuFieldRankedScore"),
        user.ranked_score,
        true,
      )
      .addField(
        this.formatMessage("commandOsuFieldTotalScore"),
        user.total_score,
        true,
      )
      .addField(
        this.formatMessage("commandOsuFieldPlayCount"),
        user.playcount,
        true,
      )
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

    await this.message.channel.send(embed);
  }
}

export const osuCommand: Command = {
  emoji: "🔴",
  name: "Osu",
  command: "osu",
  aliases: [],
  syntax: "<username>",
  examples: ["username"],
  isAdmin: false,
  description: "Get user information from Osu",

  getCommand(payload) {
    return new OsuCommand(payload);
  },
};
