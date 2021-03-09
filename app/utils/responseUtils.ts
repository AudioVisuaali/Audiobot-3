import { User, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";

import { GuildTable } from "~/dataSources/GuildDataSource";
import { UserTable } from "~/dataSources/UserDataSource";
import { FormatMessageFunction } from "~/translations/formatter";

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

  insufficientFunds(opts: {
    discordUser: User;
    user: UserTable;
    guild: GuildTable;
  }) {
    const points = this.formatCurrency({
      guild: opts.guild,
      amount: opts.user.points,
      useBold: true,
    });

    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Insufficient funds")
      .setDescription(
        `You dont have enough currency. You currently have ${points}`,
      );
  }

  insufficientFundsStock(opts: {
    discordUser: User;
    user: UserTable;
    guild: GuildTable;
  }) {
    const points = this.formatCurrency({
      guild: opts.guild,
      amount: opts.user.stock,
      useBold: true,
    });

    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Insufficient funds")
      .setDescription(
        `You dont have enough in investments. You currently have ${points} invested`,
      );
  }

  insufficientMinAmount(opts: {
    discordUser: User;
    minAmount: number;
    guild: GuildTable;
  }) {
    const minAmount = this.formatCurrency({
      guild: opts.guild,
      amount: opts.minAmount,
      useBold: true,
    });

    return this.createFooter({ user: opts.discordUser })
      .setColor(this.colors.error)
      .setTitle("Insufficient amount")
      .setDescription(`Your gambling amount needs to be atleast ${minAmount}`);
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

  formatCurrency(opts: {
    guild: GuildTable;
    amount: number;
    positivePrefix?: boolean;
    useBold?: boolean;
  }) {
    const amount =
      opts.positivePrefix && opts.amount >= 0
        ? `+${opts.amount}`
        : opts.amount.toString();
    const currencyPointsDisplayName = this.getPointsDisplayName({
      guild: opts.guild,
    });

    const formattedAmount = opts.useBold ? `**${amount}**` : amount;

    return [formattedAmount, currencyPointsDisplayName].join(" ");
  }

  formatTokens(opts: {
    amount: number;
    positivePrefix?: boolean;
    useBold?: boolean;
  }) {
    const amount =
      opts.positivePrefix && opts.amount >= 0
        ? `+${opts.amount}`
        : opts.amount.toString();

    const formattedAmount = opts.useBold ? `**${amount}**` : amount;

    return [formattedAmount, this.getTokenDisplayName()].join(" ");
  }

  getPointsDisplayName(opts: { guild: GuildTable }) {
    return opts.guild.currencyPointsDisplayName || "points";
  }

  getTokenDisplayName() {
    return "tokens";
  }

  quoteUser(opts: { user: User }) {
    return `<@${opts.user.id}>`;
  }

  quoteCasinoChannel(opts: {
    guild: GuildTable;
    formatMessage: FormatMessageFunction;
  }) {
    return opts.guild.casinoChannelId
      ? `<#${opts.guild.casinoChannelId}>`
      : opts.formatMessage("utilsResponseQuoteCasinoNone");
  }
}

export const responseUtils = new ResponseUtils();
