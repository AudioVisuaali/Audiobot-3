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
    const embed = new MessageEmbed();

    if (opts.user.avatar) {
      return new MessageEmbed()
        .setFooter(
          `Requested by ${opts.user.username}`,
          opts.user.avatarURL() ?? opts.user.defaultAvatarURL,
        )
        .setTimestamp();
    }

    return embed.setFooter(`Requested by ${opts.user.username}`).setTimestamp();
  }

  invalidPermissions(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Invalid permissions")
      .setDescription(
        "You are not authorized to run this command on this server",
      );
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
        `You dont have enough currency. You currently have **${opts.user.points}** points`,
      );
  }

  insufficientFundsStock(opts: { discordUser: User; user: UserTable }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Insufficient funds")
      .setDescription(
        `You dont have enough in investments. You currently have **${opts.user.stock}** points invested`,
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

  invalidParameter(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Invalid parameter");
  }

  cooldown(opts: { discordUser: User; availableAt: DateTime }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.neutral)
      .setTitle("You are on cooldown")
      .setDescription(`Try again ${opts.availableAt.toRelative()}`);
  }

  cannotReferenceSelf(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Invalid user")
      .setDescription("You cannot reference yourself");
  }

  invalidReferenceUser(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Invalid user")
      .setDescription("This user is not referrable");
  }

  invalidReferenceChannel(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Invalid channel")
      .setDescription("This channel is not referrable");
  }

  invalidAmountOfArguments(opts: { discordUser: User }) {
    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Invalid arguments")
      .setDescription("Amount of arguments you provided is not processable");
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
