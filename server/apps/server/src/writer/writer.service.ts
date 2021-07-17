import { Letter, LetterElement } from "../letter/entities";
import { FileService } from "../file/file.service";
import { Inject, Injectable } from "@nestjs/common";
import * as assert from "assert";
import {
  Dimension,
  Prediction,
  SurveyRespondentType,
} from "../survey/survey.types";
import { createHash } from "crypto";
import { IMAGE_FILE_SERVICE, PDF_FILE_SERVICE } from "../file/file.module";
import { LetterElementService, LetterService } from "../letter/letter.service";
import {
  SurveyResponseService,
  SurveyService,
} from "@server/src/survey/services";
import { GroupService } from "../group/group.service";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyAnalyticsService } from "@server/src/survey/services/survey-analytics.service";
import { ChartData } from "@server/src/writer/writer.types";
import { DateTime } from "luxon";
import * as _ from "lodash";
import { ResponseSummary } from "@server/src/survey/entities";
import { WriterOutput } from "@server/src/writer/entities";
import { writeFile } from "fs/promises";
import execa from "execa";
import prettyFormat from "pretty-format";

const debug = getDebugger("writer");

export function isQuillDeltaString(deltaString: string): boolean {
  return deltaString.match(/^{"ops"/) !== null;
}

type ResponseDetail = [string, string | number];

/**
 * Format a LaTeX command.
 * @param command - \command part
 * @param content - {content} part
 * @param options - [options] part
 */
function formatLaTeX(command: string, content: string, options?: string) {
  const rtn = [];
  rtn.push(`\\${command}`);
  if (options) {
    rtn.push(`[${options}]`);
  }
  rtn.push(`{${content}}`);
  return rtn.join("");
}

/**
 * Wrap `content` in an environment called `name`.
 * @param name
 * @param content
 */
function formatEnvironment(name: string, content: string) {
  return [formatLaTeX("begin", name), content, formatLaTeX("end", name)].join(
    "\n"
  );
}

/**
 * Format a hyperlink: \href{url}{text}
 * @param url
 * @param text
 */
function formatHref(url: string, text: string) {
  return `\\href{${url}}{\\underline{${text}}}`;
}

/**
 * Format verbatim text: \verb|text|
 * @param text
 */
function formatVerbatim(text: string) {
  return `\\verb|${text}|`;
}

/**
 * Format as a comment: %%%%% text
 * @param text
 */
function formatComment(text: string) {
  return `%%%%% ${text}`;
}

// Generate a hash digest for the file.
function generateBaseName(
  letterId: number,
  respondentType: SurveyRespondentType,
  groupOrResponseId: number
) {
  return createHash("sha1")
    .update(`${letterId}-${respondentType}-${groupOrResponseId}`)
    .digest("hex");
}

export class LineBuffer {
  constructor(private allLines = [], private currentLine = "") {}

  /**
   * Complete the current line, adding it to the array of all lines.
   */
  flushCurrentLine(): void {
    this.allLines.push(this.currentLine);
    this.currentLine = "";
  }

  /**
   * Append `moreChars` to the end of the current line.
   * @param moreChars
   */
  appendToCurrentLine(moreChars: string): void {
    this.currentLine += moreChars;
  }

  /**
   * Wrap the current line in LaTeX command: \wrapper{currentLine}
   * @param wrapper
   */
  wrapCurrentLine(wrapper: string): void {
    this.currentLine = formatLaTeX(wrapper, this.currentLine);
  }

  /**
   * Unpack `packed` into newline-separated lines.
   * @param packed
   */
  unpackMultipleLines(packed: string): void {
    for (const char of packed) {
      if (char === "\n") {
        this.flushCurrentLine();
      } else {
        this.currentLine += char;
      }
    }
  }

  /**
   * Concatenate together all lines.
   */
  concatenateLines(): string {
    this.flushCurrentLine();
    return "\n\n" + this.allLines.join("\n\n");
  }
}

enum TipTapNodeType {
  Document = "doc",
  Paragraph = "paragraph",
  Text = "text",
  HardBreak = "hardBreak",
  OrderedList = "orderedList",
  ListItem = "listItem",
}

enum TipTapMarkType {
  Bold = "bold",
  Italic = "italic",
}

interface TipTapMark {
  type: TipTapMarkType;
}

interface TipTapNode {
  type: TipTapNodeType;
  text: string;
  marks: TipTapMark[];
  content: TipTapNode[];
}

@Injectable()
export class WriterService {
  constructor(
    @Inject(IMAGE_FILE_SERVICE) private readonly imageFileService: FileService,
    @Inject(PDF_FILE_SERVICE) private readonly pdfFileService: FileService,
    private readonly letterService: LetterService,
    private readonly letterElementService: LetterElementService,
    private readonly surveyService: SurveyService,
    private readonly groupService: GroupService,
    private readonly surveyResponseService: SurveyResponseService,
    private readonly surveyAnalyticsService: SurveyAnalyticsService
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

  private static renderBoilerplate(letterElement: LetterElement) {
    debug("renderBoilerplate %O", letterElement);

    const textDeltaJson = JSON.parse(letterElement.textDelta);
    return isQuillDeltaString(letterElement.textDelta)
      ? renderQuillOps(textDeltaJson)
      : renderTipTap(textDeltaJson);

    /**
     * Render TipTap JSON as LaTeX.
     * @param tipTapDoc: top-level document node.
     */
    function renderTipTap(tipTapDoc: TipTapNode) {
      debug("renderTipTap %O", tipTapDoc);
      if (tipTapDoc.type !== TipTapNodeType.Document) {
        throw new Error("Bogus tipTapDoc");
      }

      const result = renderTipTapNode(tipTapDoc);
      debug("result %s", result);
      return result;
    }

    function renderTipTapNode(node: TipTapNode): string {
      switch (node.type) {
        case TipTapNodeType.Document:
          return _.reduce(
            node.content,
            (acc, n) => acc + renderTipTapNode(n),
            ""
          );
        case TipTapNodeType.Paragraph:
          return _.reduce(
            node.content,
            (acc, n) => acc + renderTipTapNode(n),
            ""
          );
        case TipTapNodeType.Text:
          return node.text;
        case TipTapNodeType.OrderedList:
          return _.reduce(
            node.content,
            (acc, n) => acc + formatLaTeX("item", renderTipTapNode(n)),
            ""
          );
        case TipTapNodeType.ListItem:
          break;
        case TipTapNodeType.HardBreak:
          return "\n";
        default:
          throw new Error(
            `Unknown node type: '${JSON.stringify(node, null, 2)}'`
          );
      }
    }

    /**
     * Render Quill Delta as LaTeX. This is the old style and should
     * be removed whenever the transition to TipTap is complete.
     * @param quillDelta
     */
    function renderQuillOps(quillDelta) {
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
                  lineBuffer.appendToCurrentLine(
                    formatLaTeX("emph", op.insert)
                  );
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
  }

  private static renderChart(chartData: ChartData) {
    debug("renderChart %O", chartData);

    function chartHeight() {
      const height =
        2.218962113 + 0.372607394 * (2 * chartData.entries.length - 1);
      return `height=${height}cm`;
    }

    const chart = `
      \\begin{adjustwidth}{0cm}{1.5cm}
      \\begin{flushright}
      \\begin{tikzpicture}
        \\begin{axis}[
          title=${chartData.title},
          xbar, xmin=0, xmax=7,
          width=0.75\\textwidth,
          ${chartHeight()},
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
    debug("renderPredictions %O", predictions);

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

  private static renderResponseDetails(details: ResponseDetail[]) {
    const formattedDetails = _.map(
      details,
      (detail) => `${detail[0]}: ${detail[1]}\\\\`
    );
    return [
      "\\vfill",
      formatEnvironment(
        "flushright",
        [
          "\\scriptsize",
          ...formattedDetails,
          `Generated: ${DateTime.local().toFormat("y-MM-dd tt")}`,
        ].join("\n")
      ),
    ].join("\n");
  }

  private async renderAllElements(
    letter: Letter,
    dimensions: Dimension[],
    predictions: Prediction[]
  ) {
    const renderedElements: string[] = [];

    for (const letterElement of letter.letterElements) {
      renderedElements.push(
        formatComment(
          `id ${letterElement.id} (${letterElement.letterElementType.key})`
        )
      );
      debug("render element %O", letterElement);
      switch (letterElement.letterElementType.key) {
        case "boilerplate-text":
          renderedElements.push(WriterService.renderBoilerplate(letterElement));
          break;
        case "demographics":
          break;
        case "dimension-chart":
          const dimension: Dimension = _.find(
            dimensions,
            (dim) => dim.id === letterElement.surveyDimension.id
          );
          debug("selected dimension %O", dimension);
          renderedElements.push(
            WriterService.renderChart(dimension.asChartData())
          );
          break;
        case "image":
          renderedElements.push(this.renderImage(letterElement));
          break;
        case "scripture-engagement-count":
          break;
        case "scripture-engagement-prediction":
          renderedElements.push(this.renderPredictions(predictions));
          break;
        default:
          throw Error(
            `Unknown element type '${letterElement.letterElementType.key}'`
          );
      }
    }
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
    debug("constructOutput - %O", writerOutput);
    return writerOutput;
  }

  private async runLaTeX(renderedElements: string[], baseName: string) {
    // Set up paths.
    const texFileName = baseName + ".tex";
    const texFilePath = this.pdfFileService.absolutePath(texFileName);
    const pdfFileName = baseName + ".pdf";
    const pdfAbsolutePath = this.pdfFileService.absolutePath(pdfFileName);

    // Create the document.
    const renderedDocument = WriterService.renderDocument(renderedElements);
    debug("rendered document");

    // Write the LaTeX source file.
    try {
      await writeFile(texFilePath, renderedDocument);
      debug("wrote document to '%s'", texFilePath);
    } catch (error) {
      debug("writeFile failed %O", error);
      throw error;
    }

    // Run LaTeX to create the PDF.
    try {
      const result = await execa("lualatex", ["--halt-on-error", texFilePath], {
        cwd: this.pdfFileService.absoluteDir(),
      });
      debug("ran LaTeX %O", result);
    } catch (errorResult) {
      debug("failed to run LaTeX %O", errorResult.shortMessage);
      throw new Error("FAILED TO RUN LaTeX");
    }

    const writerOutput = WriterService.constructOutput(
      true,
      "Letter created successfully",
      pdfFileName,
      this.pdfFileService.relativePath(pdfFileName),
      pdfAbsolutePath
    );

    debug("writer output %O", writerOutput);
    return writerOutput;
  }

  async renderIndividualLetter(letterId: number, surveyResponseId: number) {
    debug("letter %d for response %d", letterId, surveyResponseId);

    const letter = await this.letterService.readOne(letterId);
    debug("renderIndividualLetter %O", letter);

    const surveyResponse = await this.surveyResponseService.readOne(
      surveyResponseId
    );
    debug("renderIndividualLetter %O", surveyResponse);

    const dimensions =
      await this.surveyAnalyticsService.calculateSurveyDimensions(
        surveyResponse.id,
        SurveyRespondentType.Individual
      );
    debug("renderIndividualLetter dimensions %O", dimensions);

    const predictions =
      await this.surveyAnalyticsService.predictScriptureEngagementPractices(
        surveyResponse.id,
        SurveyRespondentType.Individual
      );
    debug("renderIndividualLetter %O", predictions);

    const renderedElements = await this.renderAllElements(
      letter,
      dimensions,
      predictions
    );

    renderedElements.push(
      WriterService.renderResponseDetails([
        ["Response ID", surveyResponse.id],
        ["Email", formatVerbatim(surveyResponse.email)],
      ])
    );

    const baseName = generateBaseName(
      letter.id,
      SurveyRespondentType.Individual,
      surveyResponse.id
    );
    return await this.runLaTeX(renderedElements, baseName);
  }

  async renderGroupLetter(letterId: number, groupId: number) {
    debug("letter %d for group %d", letterId, groupId);

    const letter = await this.letterService.readOne(letterId);

    const group = await this.groupService.readOne(groupId);

    const dimensions =
      await this.surveyAnalyticsService.calculateSurveyDimensions(
        group.id,
        SurveyRespondentType.Group
      );

    const predictions =
      await this.surveyAnalyticsService.predictScriptureEngagementPractices(
        group.id,
        SurveyRespondentType.Group
      );

    const renderedElements = await this.renderAllElements(
      letter,
      dimensions,
      predictions
    );

    renderedElements.push(
      WriterService.renderResponseDetails([
        ["Group ID", group.id],
        ["Group Code", group.codeWord],
        ["Admin Email", formatVerbatim(group.adminEmail)],
      ])
    );

    const baseName = generateBaseName(
      letter.id,
      SurveyRespondentType.Individual,
      group.id
    );
    return await this.runLaTeX(renderedElements, baseName);
  }
}
