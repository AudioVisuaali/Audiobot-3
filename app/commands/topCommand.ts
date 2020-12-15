import { Guild } from "discord.js";
import Table from "table-layout";

import { Command } from "~/commands/commands";
import { DataSources } from "~/dataSources/dataSources";
import { tableUtils } from "~/utils/tableUtils";

const getCurrencyHistories = async (opts: {
  dataSources: DataSources;
  discordGuild: Guild;
  args: string[];
}) => {
  const param = opts.args.length ? opts.args[0] : "win";

  switch (param) {
    case "latest":
    case "newest":
    case "new":
      return {
        type: "newest",
        histories: await opts.dataSources.currencyHistoryDS.getCurrencyHistories(
          { discordGuildId: opts.discordGuild.id },
        ),
      };

    case "won":
    case "wons":
    case "win":
    case "wins":
      return {
        type: "win",
        histories: await opts.dataSources.currencyHistoryDS.getCurrencyHistories(
          { discordGuildId: opts.discordGuild.id },
          { outcome: "DESC" },
        ),
      };

    case "lose":
    case "loses":
    case "lost":
    case "defeat":
    default:
      return {
        type: "lost",
        histories: await opts.dataSources.currencyHistoryDS.getCurrencyHistories(
          { discordGuildId: opts.discordGuild.id },
          { outcome: "ASC" },
        ),
      };
  }
};

export const topCommand: Command = {
  emoji: "📊",
  name: "Top",
  command: "top",
  aliases: [],
  syntax: "<win | lose | latest>",
  examples: ["", "win", "lose", "latest"],
  isAdmin: false,
  description: "Get history of economy on the server",

  async execute(message, args, { dataSources }) {
    const guild = await dataSources.guildDS.tryGetGuild({
      guildDiscordId: message.guild.id,
    });

    const { type, histories } = await getCurrencyHistories({
      dataSources,
      discordGuild: message.guild,
      args,
    });

    const displayHistories = await tableUtils.formatHistories({
      withName: { guildMemberManager: message.guild.members },
      includeHeader: true,
      histories,
      guild,
    });

    const table = new Table(displayHistories);

    const title = `📝 Stats for __${message.guild.name}__ in order **${type}**`;

    message.channel.send([title, "```", table.toString(), "```"].join("\n"));
  },
};
