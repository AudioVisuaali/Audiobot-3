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
}

export const mathUtils = new MathUtils();
