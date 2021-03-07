import { AbstractCommand } from "~/commands/AbstractCommand";
import { Command } from "~/commands/commands";
import { OsuResponse } from "~/services/statsService";
import { responseUtils } from "~/utils/responseUtils";

class OsuCommand extends AbstractCommand {
  private getUserFields(params: { osuUser: OsuResponse }) {
    return [
      {
        name: this.formatMessage("commandOsuFieldGlobalRank"),
        value: params.osuUser.pp_rank,
        inline: true,
      },
      {
        name: this.formatMessage("commandOsuFieldCountryRank"),
        value: params.osuUser.pp_country_rank,
        inline: true,
      },
      {
        name: this.formatMessage("commandOsuFieldCountry"),
        value: params.osuUser.country,
        inline: true,
      },
      {
        name: this.formatMessage("commandOsuFieldAccuracy"),
        value: params.osuUser.accuracy,
        inline: true,
      },
      {
        name: this.formatMessage("commandOsuFieldRankedScore"),
        value: params.osuUser.ranked_score,
        inline: true,
      },
      {
        name: this.formatMessage("commandOsuFieldTotalScore"),
        value: params.osuUser.total_score,
        inline: true,
      },
      {
        name: this.formatMessage("commandOsuFieldPlayCount"),
        value: params.osuUser.playcount,
        inline: true,
      },
      {
        name: "SSH / SS / SH / S / A / 300 / 100 / 50",
        value: [
          params.osuUser.count_rank_ssh,
          params.osuUser.count_rank_ss,
          params.osuUser.count_rank_sh,
          params.osuUser.count_rank_s,
          params.osuUser.count_rank_a,
          params.osuUser.count300,
          params.osuUser.count100,
          params.osuUser.count50,
        ].join(" / "),
      },
    ];
  }

  public async execute() {
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
      .addFields(...this.getUserFields({ osuUser: user }));

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
