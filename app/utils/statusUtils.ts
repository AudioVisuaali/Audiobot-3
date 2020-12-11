import { Client } from "discord.js";

const statuses = [
  "Going to church doesn’t make you a Christian any more than going to a garage makes you an automobile",
  "The planet is fine. The people are fucked.",
  "Well, don't expect us to be too impressed. We just saw Finnick Odair in his underwear.",
  "I did not attend his funeral, but I sent a nice letter saying I approved of it.",
  "Accept who you are. Unless you're a serial killer.",
  "Always go to other people's funerals, otherwise they won't come to yours.",
  "If you're too open-minded; your brains will fall out.",
];

export class StatusUtils {
  public getTotalServersAndUsers(opts: { client: Client }) {
    let serversCount = 0;
    let usersCount = 0;

    opts.client.guilds.cache.forEach((guild) => {
      serversCount += 1;
      usersCount += guild.memberCount;
    });

    return { serversCount, usersCount };
  }

  public getRandomStatus() {
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}
