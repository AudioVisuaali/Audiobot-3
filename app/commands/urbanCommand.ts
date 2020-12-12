import { Command } from "discord.js";

const urbanLogo =
  "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg";

export const urbanCommand: Command = {
  name: "Urban",
  command: "urban",
  aliases: ["urbandictionary", "dictionary"],
  syntax: "<query>",
  examples: ["car"],
  isAdmin: false,
  description: "Search on Urban dictionary",

  async execute(message, args, { services, utils }) {
    const query = args.join(" ");

    const urbanData = await services.stats.getUrbanResult({
      search: query,
    });

    const [first] = urbanData.list;

    const embed = utils.response
      .positive({ discordUser: message.author })
      .setTitle(query)
      .setAuthor(query, urbanLogo, first.permalink)
      .setDescription(first.definition)
      .setThumbnail(urbanLogo)
      .addField("Example", first.example, true)
      .addField(":thumbsup:", first.thumbs_up, true)
      .addField(":thumbsdown:", first.thumbs_down, true);

    message.channel.send(embed);
  },
};
