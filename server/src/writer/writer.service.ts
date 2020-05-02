import { Letter, LetterElement } from "../letter/entities";
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
import { WriterOutput } from "./entities";
import { LetterService } from "../letter/letter.service";
import { SurveyService } from "../survey/survey.service";

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
export default class WriterService {
  constructor(
    @Inject(IMAGE_FILE_SERVICE) private readonly imageFileService: FileService,
    @Inject(PDF_FILE_SERVICE) private readonly pdfFileService: FileService,
    private readonly letterService: LetterService,
    private readonly surveyService: SurveyService
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
      // console.log(JSON.stringify(op, null, 2));

      // All Quill Delta ops appear to have an `insert` property.
      assert.ok(op.hasOwnProperty("insert"));

      if (op.insert === "\n") {
        // Insert op that is just a newline.
        // Quill docs: Attributes associated with a newline character
        // describes formatting for that line.

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

  private chartHeight(chartData: ChartData) {
    const height = Math.max(chartData.entries.length + 1, 3);
    return `height=${height}cm`;
  }

  private renderChart(chartData: ChartData) {
    letterDebug("renderChart %O", chartData);

    const chart = `
      \\begin{tikzpicture}
        \\begin{axis}[
          title=${chartData.title},
          xbar, xmin=0, xmax=7,
          width=0.75\\textwidth,
          ${this.chartHeight(chartData)},
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
    return `
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
    pdfRelativePath: string = "",
    pdfAbsolutePath: string = "",
    responseSummary: ResponseSummary = null
  ) {
    const writerOutput: WriterOutput = {
      ok,
      message,
      pdfFileName,
      pdfRelativePath,
      pdfAbsolutePath,
      responseSummary
    };
    letterDebug("constructOutput: %O", writerOutput);
    return writerOutput;
  }

  private runLaTeX(
    renderedElements,
    letter: Letter,
    surveyResponse: SurveyResponse
  ): Promise<WriterOutput> {
    return new Promise((resolve, reject) => {
      // Set up paths.
      const baseName = generateBaseName(letter.id, surveyResponse.id);
      const texFileName = baseName + ".tex";
      const texFilePath = this.pdfFileService.absolutePath(texFileName);
      const pdfFileName = baseName + ".pdf";
      const pdfAbsolutePath = this.pdfFileService.absolutePath(pdfFileName);

      // Create the document.
      const renderedDocument = this.renderDocument(renderedElements);
      letterDebug("Rendered document %s", renderedDocument);

      // Write the LaTeX source file.
      writeFile(texFilePath, renderedDocument, "utf8", err => {
        if (err) {
          letterDebug("writeFile failed %O", err);
          reject(err);
        }

        // Create the PDF.
        exec(
          `lualatex ${texFilePath}`,
          { cwd: this.pdfFileService.absoluteDir() },
          (err, stdout, stderr) => {
            if (err) {
              letterDebug("lualatex exec failed %O", err);
              reject(err);
            }
            letterDebug("STDOUT %s", stdout);
            letterDebug("STDERR %s", stderr);

            const writerOutput = this.constructOutput(
              true,
              "Letter created successfully",
              pdfFileName,
              this.pdfFileService.relativePath(pdfFileName),
              pdfAbsolutePath,
              surveyResponse.summarize()
            );

            resolve(writerOutput);
          }
        );
      });
    });
  }

  async renderLetter(letterId: number, surveyResponseId: number) {
    const letter = await this.letterService.letter(letterId);
    const surveyResponse = await this.surveyService.surveyResponseComplete(
      surveyResponseId
    );

    letterDebug("renderLetter - %O", letter);
    letterDebug("renderLetter - %O", surveyResponse);

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
