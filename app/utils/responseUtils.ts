import { User, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";

import { UserTable } from "~/dataSources/UserDataSource";

class ResponseUtils {
  private colors = {
    error: "#ff0000",
    warning: "#ff9100",
    success: "#00e676",
    cooldown: "#0051ff",
    neutral: "#000000",
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

  insufficientFunds(opts: { discordUser: User; user: UserTable }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Insufficient funds")
      .setDescription(
        `You are gambling with more currency than you can afford. You currently have ${opts.user.points} points`,
      );
  }

  insufficientMinAmount(opts: { discordUser: User; minAmount: number }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Insufficient amount")
      .setDescription(
        `Your gambling amount needs to be atleast **${opts.minAmount}** points`,
      );
  }

  specifyGamblingAmount(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser }).setDescription(
      "You need to specify the amount you want to gamble",
    );
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

  neutral(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser }).setColor(
      this.colors.neutral,
    );
  }

  positive(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser }).setColor(
      this.colors.success,
    );
  }
}

export const responseUtils = new ResponseUtils();
