import { DateTime, DurationObject } from "luxon";

class TimeUtils {
  async sleep(durationMS: number) {
    return new Promise((resolve) => setTimeout(resolve, durationMS));
  }

  parseDBTime(date: Date | null) {
    return date ? DateTime.fromJSDate(date) : null;
  }

  getNextCompoundAt() {
    const now = DateTime.utc();
    const thisWeekRefresh = now.startOf("week").plus({ day: 1 }); // start of tuesday

    const isPastCompound = now.valueOf() - thisWeekRefresh.valueOf() > 0;

    return isPastCompound ? thisWeekRefresh.plus({ day: 7 }) : thisWeekRefresh;
  }

  msBetweenDates(d1: DateTime, d2: DateTime) {
    return Math.abs(d2.toMillis() - d1.toMillis());
  }

  humanReadableTimeBetweenDates(d1: DateTime, d2: DateTime) {
    return d2
      .diff(d1, ["months", "days", "hours", "minutes", "seconds"])
      .toObject();
  }

  getDurationFromMS(opts: { ms: number }) {
    const date = DateTime.utc();
    const addedDate = date.plus({ milliseconds: opts.ms });

    return this.humanReadableTimeBetweenDates(date, addedDate);
  }

  durationObjectToString(duration: DurationObject) {
    const seconds = Math.floor(duration.seconds || 0);
    const times = [
      { count: duration.days, type: "d" },
      { count: duration.hours, type: "h" },
      { count: duration.minutes, type: "m" },
      { count: seconds, type: "s" },
    ];

    const checkedNotZero = false;
    const timesCondensed = times.reduce<string[]>((acc, curr) => {
      if (curr.count === 0 && !checkedNotZero) {
        return acc;
      }

      return [...acc, `${curr.count}${curr.type}`];
    }, []);

    if (timesCondensed.length === 0) {
      return "0s";
    }

    return timesCondensed.join(" ");
  }
}

export const timeUtils = new TimeUtils();
