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
}

export const mathUtils = new MathUtils();
