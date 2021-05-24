import Chance from "chance";
const chance = new Chance();

export class CodeWord {
  private static readonly CONSONANTS = "bcdfghjklmnpqrstvwxyz".split("");
  private static readonly VOWELS = "aeiou".split("");
  private static readonly NUM_PAIRS = 4;

  static randomConsonant(): string {
    return chance.pickone(CodeWord.CONSONANTS);
  }

  static randomVowel(): string {
    return chance.pickone(CodeWord.VOWELS);
  }

  static generate(): string {
    const letters = [];
    for (let i = 0; i < CodeWord.NUM_PAIRS; i++) {
      letters.push(CodeWord.randomConsonant());
      letters.push(CodeWord.randomVowel());
    }
    return letters.join("");
  }
}
