export class TimeoutService {
  private timeoutMS = 1200;
  private timeouts = new Map<string, Date>();

  public isUserTimedOut(opts: { userDiscordId: string }) {
    const timeout = this.timeouts.get(opts.userDiscordId);

    if (!timeout) {
      this.timeouts.set(opts.userDiscordId, new Date());
      this.removeUserTimeoutAfterTimeout({
        userDiscordId: opts.userDiscordId,
      });

      return false;
    }

    const timeNow = new Date();

    if (timeNow.getTime() - timeout.getTime() < this.timeoutMS) {
      return true;
    }

    this.timeouts.delete(opts.userDiscordId);

    return false;
  }

  private removeUserTimeoutAfterTimeout(opts: { userDiscordId: string }) {
    setTimeout(() => {
      this.timeouts.delete(opts.userDiscordId);
    }, this.timeoutMS);
  }
}
