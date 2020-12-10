import { eightBallUtils, EightBallUtils } from "./eightBallUtils";
import { emojiUtils, EmojiUtils } from "./emojiUtils";
import { lennyFacesUtils, LennyFacesUtils } from "./lennyFaceUtils";
import { MathUtils } from "./mathUtil";
import { StatusUtils } from "./statusUtils";

export type Utils = {
  statusUtils: StatusUtils;
  emojiUtils: EmojiUtils;
  mathUtils: MathUtils;
  eightBallUtils: EightBallUtils;
  lennyFacesUtils: LennyFacesUtils;
};

export const createUtils = (): Utils => {
  const statusUtils = new StatusUtils();
  const mathUtils = new MathUtils();

  return {
    statusUtils,
    emojiUtils,
    mathUtils,
    eightBallUtils,
    lennyFacesUtils,
  };
};
