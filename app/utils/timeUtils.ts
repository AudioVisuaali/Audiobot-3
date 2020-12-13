import { DateTime } from "luxon";

class TimeUtils {
  async sleep(durationMS: number) {
    return new Promise((resolve) => setTimeout(resolve, durationMS));
  }

  weeksBetween(d1: DateTime, d2: DateTime) {
    return Math.floor(
      (d2.valueOf() - d1.valueOf()) / (7 * 24 * 60 * 60 * 1000),
    );
  }

  parseDBTime(date: Date | null) {
    return date ? DateTime.fromJSDate(date) : null;
  }
}

export const timeUtils = new TimeUtils();
