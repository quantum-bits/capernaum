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
import { ResponseSummary } from "../survey/entities";
import { WriterOutput } from "./entities";
import { LetterService } from "../letter/letter.service";
import { SurveyService } from "../survey/survey.service";
import * as IsEmail from "isemail";

import debug from "debug";
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
  return `\\href{${url}}{\\underline{${text}}}`;
}

function formatVerbose(text: string) {
  return `\\verb|${text}|`;
}

// Generate a hash digest for the file.
function generateBaseName(letterId: number, responseId: number) {
  return createHash("sha1").update(`${letterId}-${responseId}`).digest("hex");
}

export class LineBuffer {
  constructor(private allLines = [], private currentLine = "") {}

  flushCurrentLine(): void {
    this.allLines.push(this.currentLine);
    this.currentLine = "";
  }

  appendToCurrentLine(moreChars: string): void {
    this.currentLine += moreChars;
  }

  wrapCurrentLine(wrapper: string): void {
    this.currentLine = formatLaTeX(wrapper, this.currentLine);
  }

  unpackMultipleLines(packed: string): void {
    for (const char of packed) {
      if (char === "\n") {
        this.flushCurrentLine();
      } else {
        this.currentLine += char;
      }
    }
  }

  concatenateLines(): string {
    this.flushCurrentLine();
    return "\n\n" + this.allLines.join("\n\n");
  }
}

@Injectable()
export class WriterService {
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

  private static renderParagraph(content: string) {
    return ["", content, ""].join("\n");
  }

  private static renderBoilerplate(letterElement: LetterElement) {
    const quillDelta = JSON.parse(letterElement.textDelta);
    const lineBuffer = new LineBuffer();

    for (const op of quillDelta.ops) {
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
          for (const attribute of Object.keys(op.attributes)) {
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

  private static chartHeight(chartData: ChartData) {
    const height =
      2.218962113 + 0.372607394 * (2 * chartData.entries.length - 1); //Math.max(chartData.entries.length + 1, 3);
    return `height=${height}cm`;
  }

  private static renderChart(chartData: ChartData) {
    letterDebug("renderChart - %O", chartData);

    const chart = `
      \\begin{adjustwidth}{0cm}{1.5cm}
      \\begin{flushright}
      \\begin{tikzpicture}
        \\begin{axis}[
          title=${chartData.title},
          xbar, xmin=0, xmax=7,
          width=0.75\\textwidth,
          ${WriterService.chartHeight(chartData)},
          enlarge y limits={abs=0.5cm},
          symbolic y coords={${chartData.allTitles()}},
          ytick=data,
          %nodes near coords,
          %nodes near coords align={horizontal},
          ]
          \\addplot [fill = fillColor] coordinates {
            ${chartData.allCoordinates()}
          };
          ${chartData.allBarLabels()}
        \\end{axis}
      \\end{tikzpicture}
      \\end{flushright}
      \\end{adjustwidth}`;

    return formatEnvironment("center", chart);
  }

  private renderPredictions(predictions: Prediction[]) {
    letterDebug("renderPredictions - %O", predictions);

    return predictions
      .filter((prediction) => prediction.predict)
      .map((prediction) => {
        const practice = prediction.practice;
        return [
          formatLaTeX(
            "subsection*",
            formatHref(practice.moreInfoUrl, practice.title)
          ),
          practice.description,
        ].join("\n\n");
      })
      .join("\n\n");
  }

  private static renderFooter() {
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

  private static renderHeader() {
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

  private static renderDocument(renderedElements: string[]) {
    return `
    \\documentclass[11pt]{article}
    
    \\usepackage[hmargin=0.75in,top=1.0in,bottom=1.5in]{geometry}
    \\usepackage{graphicx}
    \\usepackage{changepage}
    \\usepackage{hyperref}
    \\hypersetup{
      colorlinks = true,
      urlcolor=[rgb]{0.31,0.51,0.21}
    }
    
    \\usepackage{pgfplots}
    \\pgfplotsset{
      compat=1.15,
      xticklabel={$\\mathsf{\\pgfmathprintnumber{\\tick}}$}
    }
    \\usepackage{fontspec}
    \\usepackage[sfdefault,lf]{carlito}
    \\renewcommand*\\oldstylenums[1]{\\carlitoOsF #1}
    \\setmainfont{Carlito}
    
    \\colorlet{fillColor}{rgb:red,1;green,2;blue,3}

    \\setlength{\\parskip}{1em}
    \\setlength\\parindent{0pt}

    \\begin{document}
    
    ${renderedElements.join("\n\n")}
    
    \\end{document}
    `;
  }

  private static renderResponseDetails(surveyResponse: SurveyResponse) {
    letterDebug("renderResponseDetails - %O", surveyResponse);

    let validatedEmail = surveyResponse.email;
    if (
      !IsEmail.validate(surveyResponse.email) ||
      surveyResponse.email.indexOf("|") >= 0
    ) {
      validatedEmail = "<invalid>";
    }

    return [
      "\\vfill",
      formatEnvironment(
        "flushright",
        [
          "\\scriptsize",
          `Response ID: ${surveyResponse.id}`,
          `Email: ${formatVerbose(validatedEmail)}`,
          `Generated: ${DateTime.local().toFormat("y-MM-dd tt")}`,
        ].join("\n\n")
      ),
    ].join("\n");
  }

  private renderAllElements(letter: Letter, surveyResponse: SurveyResponse) {
    const renderedElements = [];

    for (const letterElement of letter.letterElements) {
      letterDebug("render element - %O", letterElement);
      switch (letterElement.letterElementType.key) {
        case "boilerplate":
          renderedElements.push(WriterService.renderBoilerplate(letterElement));
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
            renderedElements.push(
              WriterService.renderChart(dimension.chartData())
            );
          } else {
            renderedElements.push(
              WriterService.renderParagraph("No data for dimension")
            );
          }
          break;
        case "footer":
          renderedElements.push(WriterService.renderFooter());
          break;
        case "header":
          renderedElements.push(WriterService.renderHeader());
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

    renderedElements.push(WriterService.renderResponseDetails(surveyResponse));

    return renderedElements;
  }

  private static constructOutput(
    ok: boolean,
    message: string,
    pdfFileName = "",
    pdfRelativePath = "",
    pdfAbsolutePath = "",
    responseSummary: ResponseSummary = null
  ) {
    const writerOutput: WriterOutput = {
      ok,
      message,
      pdfFileName,
      pdfRelativePath,
      pdfAbsolutePath,
      responseSummary,
    };
    letterDebug("constructOutput - %O", writerOutput);
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
      const renderedDocument = WriterService.renderDocument(renderedElements);
      letterDebug("Rendered document %s", renderedDocument);

      // Write the LaTeX source file.
      writeFile(texFilePath, renderedDocument, "utf8", (err) => {
        if (err) {
          letterDebug("writeFile failed - %O", err);
          reject(err);
        }

        // Create the PDF.
        exec(
          `lualatex ${texFilePath}`,
          { cwd: this.pdfFileService.absoluteDir() },
          (err, stdout, stderr) => {
            if (err) {
              letterDebug("lualatex exec failed - %O", err);
              reject(err);
            }
            letterDebug("STDOUT %s", stdout);
            letterDebug("STDERR %s", stderr);

            const writerOutput = WriterService.constructOutput(
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
    letterDebug("renderLetter - ", surveyResponse);

    if (!letter) {
      return Promise.resolve(
        WriterService.constructOutput(false, "No letter found")
      );
    } else if (!surveyResponse) {
      return Promise.resolve(
        WriterService.constructOutput(false, "No responses for this survey")
      );
    } else {
      const renderedElements = this.renderAllElements(letter, surveyResponse);
      return await this.runLaTeX(renderedElements, letter, surveyResponse);
    }
  }
}
