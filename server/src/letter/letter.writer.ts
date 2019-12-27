import { Letter, LetterElement, LetterWriterOutput } from "./entities";
import { exec } from "child_process";
import { writeFile } from "fs";
import { SurveyResponse } from "../survey/entities";
import { FileService } from "../file/file.service";
import { Inject, Injectable } from "@nestjs/common";
import * as assert from "assert";
import { ChartData, Prediction } from "../survey/survey.types";
import { createHash } from "crypto";
import { IMAGE_FILE_SERVICE, PDF_FILE_SERVICE } from "../file/file.module";
import { DateTime } from "luxon";
import debug from "debug";
import { ResponseSummary } from "../survey/entities/survey-response-summary";

const letterDebug = debug("letter");

function formatLaTeX(command: string, content: string, options?: string) {
  const rtn = [];
  rtn.push(`\\${command}`);
  if (options) {
    rtn.push(`[${options}]`);
  }
  rtn.push(`{${content}}`);
  return rtn.join("");
}

function formatEnvironment(name: string, content: string) {
  return [formatLaTeX("begin", name), content, formatLaTeX("end", name)].join(
    "\n"
  );
}

function formatHref(url: string, text: string) {
  return `\\href{${url}}{${text}}`;
}

// Generate a hash digest for the file.
function generateBaseName(letterId: number, responseId: number) {
  return createHash("sha1")
    .update(`${letterId}-${responseId}`)
    .digest("hex");
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
    return "\n\n" + this.allLines.join("\n\n");
  }
}

@Injectable()
export default class LetterWriter {
  constructor(
    @Inject(IMAGE_FILE_SERVICE)
    private readonly imageFileService: FileService,
    @Inject(PDF_FILE_SERVICE) private readonly pdfFileService: FileService
  ) {}

  private renderImage(letterElement: LetterElement) {
    const fullPath = this.imageFileService.absolutePath(
      letterElement.image.fileName()
    );
    return formatEnvironment(
      "flushleft",
      formatLaTeX("includegraphics", fullPath, "width=\\textwidth")
    );
  }

  private renderParagraph(content: string) {
    return ["", content, ""].join("\n");
  }

  private renderBoilerplate(letterElement: LetterElement) {
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
            wrapper = "section*";
          } else if (op.attributes.header === 2) {
            wrapper = "subsection*";
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

  private renderChart(chartData: ChartData) {
    letterDebug("renderChart %O", chartData);

    const chart = `
      \\begin{tikzpicture}
        \\begin{axis}[
          title=${chartData.title},
          xbar, xmin=0, xmax=7,
          width=0.75\\textwidth,
          height=${chartData.entries.length + 1}cm,
          enlarge y limits={abs=0.5cm},
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

    return formatEnvironment("center", chart);
  }

  private renderPredictions(predictions: Prediction[]) {
    letterDebug("renderPredictions %O", predictions);

    return predictions
      .filter(prediction => prediction.predict)
      .map(prediction => {
        const practice = prediction.practice;
        return [
          formatLaTeX(
            "subsection*",
            formatHref(practice.moreInfoUrl, practice.title)
          ),
          practice.description
        ].join("\n\n");
      })
      .join("\n\n");
  }

  private renderFooter() {
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

  private renderHeader() {
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

  private renderDocument(renderedElements: string[]) {
    const document = `
    \\documentclass{article}
    
    \\usepackage[hmargin=0.75in,top=1.0in,bottom=1.5in]{geometry}
    \\usepackage{graphicx}
    \\usepackage[colorlinks]{hyperref}
    
    \\usepackage{pgfplots}
    \\pgfplotsset{compat=1.15}
    
    \\begin{document}
    
    ${renderedElements.join("\n\n")}
    
    \\end{document}
    `;

    letterDebug("renderDocument %s", document);
    return document;
  }

  private renderResponseDetails(surveyResponse: SurveyResponse) {
    letterDebug("renderResponseDetails %O", surveyResponse);

    return [
      "\\vfill",
      formatEnvironment(
        "flushright",
        [
          "\\scriptsize",
          `Response ID: ${surveyResponse.id}`,
          `Email: ${surveyResponse.email}`,
          `Generated: ${DateTime.local().toFormat("y-MM-dd tt")}`
        ].join("\n\n")
      )
    ].join("\n");
  }

  private renderAllElements(letter: Letter, surveyResponse: SurveyResponse) {
    const renderedElements = [];

    for (const letterElement of letter.letterElements) {
      letterDebug("renderLetter - element %O", letterElement);
      switch (letterElement.letterElementType.key) {
        case "boilerplate":
          renderedElements.push(this.renderBoilerplate(letterElement));
          break;
        case "boolean-calculation-results":
          const predictions = surveyResponse.predictScriptureEngagement();
          renderedElements.push(this.renderPredictions(predictions));
          break;
        case "chart":
          const dimension = surveyResponse.findDimensionById(
            letterElement.surveyDimension.id
          );
          if (dimension) {
            renderedElements.push(this.renderChart(dimension.chartData()));
          } else {
            renderedElements.push(
              this.renderParagraph("No data for dimension")
            );
          }
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

    renderedElements.push(this.renderResponseDetails(surveyResponse));

    return renderedElements;
  }

  private constructOutput(
    ok: boolean,
    message: string,
    pdfFileName: string = "",
    pdfFilePath: string = "",
    responseSummary: ResponseSummary = null
  ) {
    const letterWriterOutput: LetterWriterOutput = {
      ok,
      message,
      pdfFileName,
      pdfFilePath,
      responseSummary
    };
    letterDebug("constructOutput: %O", letterWriterOutput);
    return letterWriterOutput;
  }

  private runLaTeX(
    renderedElements,
    letter: Letter,
    surveyResponse: SurveyResponse
  ): Promise<LetterWriterOutput> {
    return new Promise((resolve, reject) => {
      // Set up paths.
      const baseName = generateBaseName(letter.id, surveyResponse.id);
      const texFileName = baseName + ".tex";
      const texFilePath = this.pdfFileService.absolutePath(texFileName);
      const pdfFileName = baseName + ".pdf";
      const pdfFilePath = this.pdfFileService.absolutePath(pdfFileName);

      // Create the document.
      const result = this.renderDocument(renderedElements);

      // Write the LaTeX source file.
      writeFile(texFilePath, result, "utf8", err => {
        if (err) {
          reject(err);
        }

        // Create the PDF.
        exec(
          `lualatex ${texFilePath}`,
          { cwd: this.pdfFileService.absoluteDir() },
          (err, stdout, stderr) => {
            if (err) {
              reject(err);
            }
            // console.log("STDOUT", stdout);
            // console.log("STDERR", stderr);
          }
        );
      });

      const letterWriterOutput = this.constructOutput(
        true,
        "Letter created successfully",
        pdfFileName,
        this.pdfFileService.relativePath(pdfFileName),
        surveyResponse.summarize()
      );

      resolve(letterWriterOutput);
    });
  }

  renderLetter(letter: Letter, surveyResponse: SurveyResponse) {
    letterDebug("renderLetter - letter %O", letter);
    letterDebug("renderLetter - response %O", surveyResponse);

    if (!letter) {
      return Promise.resolve(this.constructOutput(false, "No letter found"));
    } else if (!surveyResponse) {
      return Promise.resolve(
        this.constructOutput(false, "No responses for this survey")
      );
    } else {
      const renderedElements = this.renderAllElements(letter, surveyResponse);
      return this.runLaTeX(renderedElements, letter, surveyResponse);
    }
  }
}
