export class MathUtils {
  public getRandomArbitrary(min: number, max: number) {
    // min: Incluside, max: Inclusive
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }

  public parseStringToNumber = (number: string) => {
    const parsed = parseInt(number);

    return isNaN(parsed) ? null : parsed;
  };
}
