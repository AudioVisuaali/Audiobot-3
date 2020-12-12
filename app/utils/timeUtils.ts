class TimeUtils {
  async sleep(durationMS: number) {
    return new Promise((resolve) => setTimeout(resolve, durationMS));
  }
}

export const timeUtils = new TimeUtils();
