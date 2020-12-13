import { Message } from "discord.js";

import { mathUtils } from "./mathUtil";

class InputUtils {
  public getAmountFromUserInput(opts: {
    input: string;
    currentPoints: number;
  }) {
    switch (opts.input) {
      case "all":
        return opts.currentPoints;

      case "half":
        return Math.floor(opts.currentPoints / 2);

      case "third":
        return Math.floor(opts.currentPoints / 3);
    }

    if (opts.input.endsWith("%")) {
      const percent = parseFloat(opts.input);

      if (isNaN(percent) || percent < 0 || percent > 100) {
        return null;
      }

      return Math.floor(opts.currentPoints * (percent / 100));
    }

    return mathUtils.parseStringToNumber(opts.input);
  }

  public getUserMention = (opts: {
    message: Message;
    mentionInString: string;
  }) => {
    const mentions = opts.message.mentions.users.values();

    for (const mention of mentions) {
      if (opts.mentionInString.includes(mention.id)) {
        return mention;
      }
    }
  };
}

export const inputUtils = new InputUtils();
