import { ConfigureOptions, Environment, FileSystemLoader } from "nunjucks";
import { Letter, LetterWriterOutput } from "./entities";
import { exec } from "child_process";
import { writeFile } from "fs";
import { format, join } from "path";
import { SurveyResponse } from "../survey/entities";
import * as assert from "assert";

const WORKING_DIR = "/Users/tom/Scratch";

const VALID_ELEMENT_TYPES = [
  "boilerplate",
  "boolean-calculation-results",
  "footer",
  "header",
  "chart",
  "image"
];

export function formatLaTeX(command: string, content: string) {
  return `\\${command}{${content}}`;
}

export class LineBuffer {
  constructor(private allLines = [], private currentLine = "") {}

  flushCurrentLine() {
    this.allLines.push(this.currentLine);
    this.currentLine = "";
  }

  appendToCurrentLine(moreChars: string) {
    this.currentLine += moreChars;
  }

  wrapCurrentLine(wrapper: string) {
    this.currentLine = formatLaTeX(wrapper, this.currentLine);
  }

  unpackMultipleLines(packed: string) {
    for (let char of packed) {
      if (char === "\n") {
        this.flushCurrentLine();
      } else {
        this.currentLine += char;
      }
    }
  }

  concatenateLines() {
    this.flushCurrentLine();
    return this.allLines.join("\n\n");
  }
}

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
    surveyResponse: SurveyResponse
  ): Promise<LetterWriterOutput> {
    console.log("LETTER", JSON.stringify(letter, null, 2));
    // console.log("RESPONSE", JSON.stringify(surveyResponse, null, 2));
    surveyResponse.dump();

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
        name: `${letter.id}-${surveyResponse.id}`
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
