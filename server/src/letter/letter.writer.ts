import { ConfigureOptions, Environment, FileSystemLoader } from "nunjucks";
import { Letter, LetterWriterInput } from "./entities";
import { LetterService } from "./letter.service";

export default class LaTeXWriter {
  private environment: Environment;

  constructor(protected readonly letterService: LetterService) {
    const loader = new FileSystemLoader("./src/letter/templates");
    const configuration: ConfigureOptions = {
      autoescape: true
    };
    this.environment = new Environment(loader, configuration);
  }

  async render(letterWriterInput: LetterWriterInput) {
    const letter: Letter = await this.letterService.findOne(
      Letter,
      letterWriterInput.letterId
    );
    const result = this.environment.render("letter.tex", { letter });
    return result;
  }
}
