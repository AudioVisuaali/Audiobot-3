import { eightBallUtils, EightBallUtils } from "./eightBallUtils";
import { emojiUtils, EmojiUtils } from "./emojiUtils";
import { lennyFacesUtils, LennyFacesUtils } from "./lennyFaceUtils";
import { MathUtils } from "./mathUtil";
import { ResponseUtils } from "./responseUtils";
import { StatusUtils } from "./statusUtils";

export type Utils = {
  status: StatusUtils;
  emoji: EmojiUtils;
  math: MathUtils;
  eightBall: EightBallUtils;
  lennyFaces: LennyFacesUtils;
  response: ResponseUtils;
};

export const createUtils = (): Utils => ({
  status: new StatusUtils(),
  emoji: emojiUtils,
  math: new MathUtils(),
  eightBall: eightBallUtils,
  lennyFaces: lennyFacesUtils,
  response: new ResponseUtils(),
});
