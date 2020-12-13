class MathUtils {
  public getRandomArbitrary(min: number, max: number) {
    // min: Incluside, max: Inclusive
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }

  public parseStringToNumber = (number: string) => {
    const parsed = parseInt(number);

    return isNaN(parsed) ? null : parsed;
  };

  public shuffleList<T>(items: T[]): T[] {
    return items.sort(() => 0.5 - Math.random());
  }

  public compoundMultiply(opts: {
    value: number;
    compoundPercent: number;
    compoundCount: number;
  }) {
    let newValue = opts.value;

    for (let i = 0; i < opts.compoundCount; i += 1) {
      newValue = newValue * (1 + opts.compoundPercent / 100);
    }

    return Math.floor(newValue);
  }

  public kelvinToCelsius(opts: { kelvin: number }) {
    return Math.round(opts.kelvin - 273.15);
  }

  public kelvinToFahrenheit(opts: { kelvin: number }) {
    return Math.round(((opts.kelvin - 273.15) * 9) / 5 + 32);
  }

  public getBonusCount(opts: {
    current: number;
    minPercent?: number;
    maxPercent?: number;
  }) {
    const min = opts.minPercent || 6;
    const max = opts.maxPercent || 10;
    const percent = this.getRandomArbitrary(min, max);

    const bonusCurrent = Math.floor((percent / 100) * opts.current);

    return { percent, bonusCurrent };
  }
}

export const mathUtils = new MathUtils();
