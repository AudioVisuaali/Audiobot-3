import { Message } from "discord.js";

import { mathUtils } from "./mathUtil";

const isNumber = (value: string) => /^\d+$/.test(value);

const getPercentValue = (params: { input: string; currentPoints: number }) => {
  const value = params.input.slice(0, -1);

  if (!isNumber(value)) {
    return null;
  }

  const percent = parseInt(value, 10);

  if (isNaN(percent) || percent < 0 || percent > 100) {
    return null;
  }

  return Math.floor(params.currentPoints * (percent / 100));
};

const getKiloValue = (params: { input: string }) => {
  const value = params.input.slice(0, -1);

  if (!isNumber(value)) {
    return null;
  }

  const points = parseInt(value, 10);

  if (isNaN(points) || points < 0) {
    return null;
  }

  return points * 1000;
};

const getMillionValue = (params: { input: string }) => {
  const value = params.input.slice(0, -1);

  if (!isNumber(value)) {
    return null;
  }

  const points = parseInt(value, 10);

  if (isNaN(points) || points < 0) {
    return null;
  }

  return points * 1000000;
};

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
      return getPercentValue({
        input: opts.input,
        currentPoints: opts.currentPoints,
      });
    }

    if (opts.input.toLowerCase().endsWith("k")) {
      return getKiloValue({ input: opts.input });
    }

    if (opts.input.toLowerCase().endsWith("m")) {
      return getMillionValue({ input: opts.input });
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

  public getChannelMention = (opts: {
    message: Message;
    mentionInString: string;
  }) => {
    const mentions = opts.message.mentions.channels.values();

    for (const mention of mentions) {
      if (opts.mentionInString.includes(mention.id)) {
        return mention;
      }
    }
  };

  public getMessageCommandAndArgs(opts: { message: Message; prefix: string }) {
    return opts.message.content.slice(opts.prefix.length).trim().split(/ +/);
  }
}

export const inputUtils = new InputUtils();
