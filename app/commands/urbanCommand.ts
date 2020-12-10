import { MessageEmbed, Command } from "discord.js";

const urbanLogo =
  "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg";

export const urbanCommand: Command = {
  name: "Urban",
  command: "urban",
  aliases: ["urbandictionary", "dictionary"],
  description: "Search on Urban dictionary",

  async execute(message, args, context) {
    const query = args.join(" ");

    const urbanData = await context.services.statsService.getUrbanResult({
      search: query,
    });

    const [first] = urbanData.list;

    const embed = new MessageEmbed()
      .setTitle(query)
      .setAuthor(query, urbanLogo, first.permalink)
      .setColor("#f99e1a")
      .setDescription(first.definition)
      .setThumbnail(urbanLogo)
      .addField("Example", first.example, true)
      .addField(":thumbsup:", first.thumbs_up, true)
      .addField(":thumbsdown:", first.thumbs_down, true)
      .setFooter(`Sent by ${first.author}`)
      .setTimestamp();

    message.channel.send(embed);
  },
};
