import { DateTime, DurationObject } from "luxon";

class TimeUtils {
  async sleep(durationMS: number) {
    return new Promise((resolve) => setTimeout(resolve, durationMS));
  }

  parseDBTime(date: Date | null) {
    return date ? DateTime.fromJSDate(date) : null;
  }

  getNextCompoundAt() {
    return DateTime.utc()
      .startOf("week")
      .set({ weekday: 2 }) // Tuesday
      .plus({ week: 1 });
  }

  msBetweenDates(d1: DateTime, d2: DateTime) {
    return Math.abs(d2.toMillis() - d1.toMillis());
  }

  humanReadableTimeBetweenDates(d1: DateTime, d2: DateTime) {
    return d2
      .diff(d1, ["months", "days", "hours", "minutes", "seconds"])
      .toObject();
  }

  nextCompoundString(duration: DurationObject) {
    const seconds = Math.floor(duration.seconds || 0);
    const times = [
      `${duration.days}d`,
      `${duration.hours}h`,
      `${duration.minutes}m`,
      `${seconds}s`,
    ];

    return times.join(" ");
  }
}

export const timeUtils = new TimeUtils();
