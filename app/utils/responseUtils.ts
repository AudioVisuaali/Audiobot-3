import { User, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";

export class ResponseUtils {
  private colors = {
    error: "#ff0000",
    warning: "#ff9100",
    success: "#00e676",
    neutral: "#0051ff",
  };

  private createFooter(opts: { user: User }) {
    const embed = new MessageEmbed().setTimestamp();

    if (opts.user.avatar) {
      return new MessageEmbed().setFooter(
        `Requested by ${opts.user.username}`,
        opts.user.avatarURL() ?? opts.user.defaultAvatarURL,
      );
    }

    return embed.setFooter(`Requested by ${opts.user.username}`);
  }

  invalidCurrency(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Invalid value")
      .setDescription("The amount you gave is not valid");
  }

  insufficientFunds(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Insufficient funds");
  }

  cooldown(opts: { discordUser: User; availableAt: DateTime }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.neutral)
      .setTitle("You are on cooldown")
      .setDescription(`Try again ${opts.availableAt.toRelative()}`);
  }

  negative(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser }).setColor(
      this.colors.warning,
    );
  }

  positive(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser }).setColor(
      this.colors.success,
    );
  }
}
