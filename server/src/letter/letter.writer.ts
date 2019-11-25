import { ConfigureOptions, Environment, FileSystemLoader } from "nunjucks";
import { Letter, LetterElement, LetterWriterOutput } from "./entities";
import { exec } from "child_process";
import { writeFile } from "fs";
import { format, join } from "path";
import { SurveyResponse } from "../survey/entities";
import { FileService } from "../file/file.service";
import { Injectable } from "@nestjs/common";
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

export function formatLaTeX(
  command: string,
  content: string,
  options?: string
) {
  const rtn = [];
  rtn.push(`\\${command}`);
  if (options) {
    rtn.push(`[${options}]`);
  }
  rtn.push(`{${content}}`);
  const foo = rtn.join("");
  console.log("FOO", foo);
  return foo;
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

@Injectable()
export default class LetterWriter {
  private environment: Environment;

  constructor(private readonly fileService: FileService) {
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

  renderImage(letterElement: LetterElement) {
    console.log("RENDER IMAGE", letterElement);
    const fullPath = this.fileService.fullPath(letterElement.image.fileName());
    console.log("FULL PATH", fullPath);
    return formatLaTeX("includegraphics", fullPath, "width=\\textwidth");
  }

  renderBoilerplate(letterElement: LetterElement) {
    console.log("RENDER BOILERPLATE", letterElement);
    const quillDelta = JSON.parse(letterElement.textDelta);
    const lineBuffer = new LineBuffer();

    for (let op of quillDelta.ops) {
      assert.ok(op.hasOwnProperty("insert"));
      // console.log(JSON.stringify(op, null, 2));

      if (op.insert === "\n") {
        // Insert op that is just a newline.
        assert.ok(op.hasOwnProperty("attributes"));
        let wrapper = "";
        if (op.attributes.hasOwnProperty("header")) {
          if (op.attributes.header === 1) {
            wrapper = "section";
          } else if (op.attributes.header === 2) {
            wrapper = "subsection";
          } else {
            throw Error(`Bogus attributes ${op.attributes}`);
          }
        }
        if (op.attributes.hasOwnProperty("list")) {
          wrapper = "item";
        }
        lineBuffer.wrapCurrentLine(wrapper);
        lineBuffer.flushCurrentLine();
      } else {
        // Insert op that is not just a newline.
        if (op.hasOwnProperty("attributes")) {
          // More than a newline and has attributes.
          for (let attribute of Object.keys(op.attributes)) {
            switch (attribute) {
              case "bold":
                lineBuffer.appendToCurrentLine(
                  formatLaTeX("textbf", op.insert)
                );
                break;
              case "italic":
                lineBuffer.appendToCurrentLine(formatLaTeX("emph", op.insert));
                break;
              default:
                throw Error(`Unknown attribute ${attribute}`);
            }
          }
        } else {
          // More than a newline and don't have attributes.
          lineBuffer.unpackMultipleLines(op.insert);
        }
      }
    }

    return lineBuffer.concatenateLines();
  }

  renderLetter(
    letter: Letter,
    surveyResponse: SurveyResponse
  ): Promise<LetterWriterOutput> {
    // console.log("LETTER", JSON.stringify(letter, null, 2));
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
        writer: this,
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
