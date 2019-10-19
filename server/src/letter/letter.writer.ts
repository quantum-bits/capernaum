import { ConfigureOptions, Environment, FileSystemLoader } from "nunjucks";
import { Letter } from "./entities";
import { exec } from "child_process";
import { writeFile } from "fs";

const VALID_ELEMENT_TYPES = [
  "boilerplate",
  "boolean-calculation-results",
  "footer",
  "header",
  "chart"
];

export default class LetterWriter {
  private environment: Environment;

  constructor() {
    const loader = new FileSystemLoader("./src/letter/templates");
    const configuration: ConfigureOptions = {
      autoescape: true
    };
    this.environment = new Environment(loader, configuration);
  }

  async render(letter: Letter) {
    // Validate element types.
    for (const letterElement of letter.letterElements) {
      const key = letterElement.letterElementType.key;
      if (!VALID_ELEMENT_TYPES.includes(key)) {
        throw Error(`Invalid element type '${key}'`);
      }
    }

    this.environment.render("letter.tex", { letter }, (err, result) => {
      if (err) {
        throw err;
      }
      writeFile("./foo.tex", result, "utf8", err => {
        if (err) {
          throw err;
        }
        exec("pdflatex foo.tex", (err, stdout, stderr) => {
          if (err) {
            throw err;
          }
          console.log("STDOUT", stdout);
          console.log("STDERR", stderr);
          return "OK";
        });
      });
    });
  }
}
