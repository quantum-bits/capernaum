import { ConfigureOptions, Environment, FileSystemLoader } from "nunjucks";
import { Letter, LetterWriterOutput } from "./entities";
import { exec } from "child_process";
import { writeFile } from "fs";
import { format, join } from "path";

const WORKING_DIR = "/Users/tom/Scratch";

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
      autoescape: false,
      tags: {
        variableStart: "<$",
        variableEnd: "$>"
      }
    };
    this.environment = new Environment(loader, configuration);
  }

  render(
    letter: Letter,
    surveyResponseId: number
  ): Promise<LetterWriterOutput> {
    return new Promise((resolve, reject) => {
      // Validate element types.
      for (const letterElement of letter.letterElements) {
        const key = letterElement.letterElementType.key;
        if (!VALID_ELEMENT_TYPES.includes(key)) {
          reject(`Invalid element type '${key}'`);
        }
      }

      const templateDir = join(process.cwd(), "src/letter/templates");
      const pathObject = {
        dir: WORKING_DIR,
        name: `${letter.id}-${surveyResponseId}`
      };
      const texFilePath = format({ ...pathObject, ext: ".tex" });
      const pdfFilePath = format({ ...pathObject, ext: ".pdf" });

      const result = this.environment.render("letter.tex", {
        letter,
        templateDir
      });

      writeFile(texFilePath, result, "utf8", err => {
        if (err) {
          reject(err);
        }
        exec(
          `pdflatex ${texFilePath}`,
          { cwd: WORKING_DIR },
          (err, stdout, stderr) => {
            if (err) {
              reject(err);
            }
            // console.log("STDOUT", stdout);
            // console.log("STDERR", stderr);
          }
        );
      });

      resolve({ ok: true, pdfFilePath });
    });
  }
}
