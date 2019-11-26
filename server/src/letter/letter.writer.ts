import { Letter, LetterElement, LetterWriterOutput } from "./entities";
import { exec } from "child_process";
import { writeFile } from "fs";
import { format } from "path";
import { SurveyResponse } from "../survey/entities";
import { FileService } from "../file/file.service";
import { Injectable } from "@nestjs/common";
import * as assert from "assert";
import { ChartData } from "../survey/survey.types";

const WORKING_DIR = "/Users/tom/Scratch";

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
  return rtn.join("");
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
  constructor(private readonly fileService: FileService) {}

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

  renderChart(chartData: ChartData) {
    console.log("RENDER CHART", chartData);

    return `
      \\begin{tikzpicture}
        \\begin{axis}[
          title=${chartData.title},
          xbar, xmin=0, xmax=7,
          width=12cm,
          height=7.5cm,
          enlarge y limits=0.25,
          symbolic y coords={${chartData.allTitles()}},
          ytick=data,
          nodes near coords,
          nodes near coords align={horizontal},
          ]
          \\addplot coordinates {
            ${chartData.allCoordinates()}
          };
        \\end{axis}
      \\end{tikzpicture}`;
  }

  renderPredictions(letterElement: LetterElement) {
    return "SEP PREDICTION TABLE";
  }

  renderFooter() {
    return `
      \\vfill
      \\begin{center}
        \\vspace{0.25in}
        \\href{http://tucse.taylor.edu/}{\\includegraphics{<$ templateDir $>/c4se-logo}}
      
        \\vspace{0.25in}
        \\href{http://tucse.taylor.edu/}{Taylor University Center for Scripture Engagement}
      
        \\vspace{0.25in}
        \\href{https://www.biblegateway.com/resources/scripture-engagement/}{Bible Engagement at Bible Gateway }
      \\end{center}
      `;
  }

  renderHeader() {
    return `
    \\begin{multicols}{2}
    \\begin{flushleft}
      \\Huge
      Your personal results\\\\for the Christian Life Survey
    \\end{flushleft}
    \\columnbreak
    \\includegraphics{<$ templateDir $>/c4se-logo}
    \\end{multicols}
    `;
  }

  renderDocument(renderedElements: string[]) {
    return `
    \\documentclass{article}

    \\usepackage[margin=0.75in]{geometry}
    \\usepackage{graphicx}
    \\usepackage{multicol}
    \\usepackage[colorlinks]{hyperref}
    \\usepackage{framed}
    
    \\usepackage{pgfplots}
    \\pgfplotsset{compat=1.16}
    
    \\begin{document}
    
    ${renderedElements.join("\n\n")}
    
    \\end{document}
    `;
  }

  renderLetter(
    letter: Letter,
    surveyResponse: SurveyResponse
  ): Promise<LetterWriterOutput> {
    console.log("LETTER", JSON.stringify(letter, null, 2));
    console.log("RESPONSE", JSON.stringify(surveyResponse, null, 2));
    surveyResponse.dump();

    return new Promise((resolve, reject) => {
      // Render letter elements.
      const renderedElements = [];

      for (const letterElement of letter.letterElements) {
        switch (letterElement.letterElementType.key) {
          case "boilerplate":
            renderedElements.push(this.renderBoilerplate(letterElement));
            break;
          case "boolean-calculation-results":
            renderedElements.push(this.renderPredictions(letterElement));
            break;
          case "chart":
            const dimension = surveyResponse.findDimensionById(
              letterElement.surveyDimension.id
            );
            renderedElements.push(this.renderChart(dimension.chartData()));
            break;
          case "footer":
            renderedElements.push(this.renderFooter());
            break;
          case "header":
            renderedElements.push(this.renderHeader());
            break;
          case "image":
            renderedElements.push(this.renderImage(letterElement));
            break;
          default:
            throw Error(
              `Unknown element type '${letterElement.letterElementType.key}'`
            );
        }
      }

      // Set up paths.
      const pathObject = {
        dir: WORKING_DIR,
        name: `${letter.id}-${surveyResponse.id}`
      };
      const texFilePath = format({ ...pathObject, ext: ".tex" });
      const pdfFilePath = format({ ...pathObject, ext: ".pdf" });

      // Create the document.
      const result = this.renderDocument(renderedElements);

      // Write the LaTeX source file.
      writeFile(texFilePath, result, "utf8", err => {
        if (err) {
          reject(err);
        }

        // Create the PDF.
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
