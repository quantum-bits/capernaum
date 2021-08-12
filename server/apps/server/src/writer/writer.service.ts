import { Letter, LetterElement } from "../letter/entities";
import { FileService } from "../file/file.service";
import { Inject, Injectable } from "@nestjs/common";
import * as assert from "assert";
import {
  Dimension,
  Prediction,
  PredictionCount,
  SurveyRespondentType,
} from "../survey/survey.types";
import { IMAGE_FILE_SERVICE, REPORT_FILE_SERVICE } from "../file/file.module";
import { LetterElementService, LetterService } from "../letter/letter.service";
import {
  SurveyResponseService,
  SurveyService,
} from "@server/src/survey/services";
import { GroupService } from "../group/group.service";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyAnalyticsService } from "@server/src/survey/services/survey-analytics.service";
import { DateTime } from "luxon";
import * as _ from "lodash";
import { ResponseSummary } from "@server/src/survey/entities";
import { WriterOutput } from "@server/src/writer/entities";
import { writeFile } from "fs/promises";
import execa from "execa";
import { VisualizationService } from "@server/src/visualization/visualization.service";
import { localeDate } from "@helpers/formatting";

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

function formatCenter(content: string) {
  return formatEnvironment("center", content);
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
  BulletList = "bulletList",
  Document = "doc",
  HardBreak = "hardBreak",
  Heading = "heading",
  ListItem = "listItem",
  OrderedList = "orderedList",
  Paragraph = "paragraph",
  Text = "text",
}

enum TipTapMarkType {
  Bold = "bold",
  Italic = "italic",
}

interface TipTapMark {
  type: TipTapMarkType;
}

type TipTapAttributes = { [key: string]: string | number };

interface TipTapNode {
  type: TipTapNodeType;
  attrs: TipTapAttributes;
  text: string;
  marks: TipTapMark[];
  content: TipTapNode[];
}

export interface GroupDemographics {
  responseCount: number;
  earliestResponse: string;
  latestResponse: string;
}

interface RenderParameters {
  letter: Letter;
  dimensions: Dimension[];
  predictions: Prediction[];
  predictionCounts?: PredictionCount[];
  groupDemographics?: GroupDemographics;
}

@Injectable()
export class WriterService {
  constructor(
    @Inject(IMAGE_FILE_SERVICE)
    private readonly imageFileService: FileService,
    @Inject(REPORT_FILE_SERVICE)
    private readonly reportFileService: FileService,

    private readonly letterService: LetterService,
    private readonly letterElementService: LetterElementService,
    private readonly surveyService: SurveyService,
    private readonly groupService: GroupService,
    private readonly surveyResponseService: SurveyResponseService,
    private readonly surveyAnalyticsService: SurveyAnalyticsService,
    private readonly visualizationService: VisualizationService
  ) {}

  /**
   * 1. Generate a relative directory in which to store the files associated with a report.
   *    Files will end up at locations like these:
   *      .../survey-38/group-42/report.pdf
   *      .../survey-38/individual-30517/report.pdf
   *      .../survey-38/individual-30517/dimension-9.pdf
   * 2. Set the FileService's working directory.
   *
   * @param surveyId
   * @param type
   * @param groupOrResponseId
   */
  async setWorkingDir(
    surveyId: number,
    type: SurveyRespondentType,
    groupOrResponseId: number
  ): Promise<string> {
    const workDir = `survey-${surveyId}/${type}-${groupOrResponseId}`;
    const absoluteDir = await this.reportFileService.setWorkingDir(workDir);
    debug(`Absolute dir now '${absoluteDir}'`);
    return workDir;
  }

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
      debug("LaTeX %s", result);
      return result;
    }

    function renderTipTapNode(tipTapNode: TipTapNode): string {
      const reducedContent = _.reduce(
        tipTapNode.content,
        (acc, node) => acc + renderTipTapNode(node),
        ""
      );

      switch (tipTapNode.type) {
        case TipTapNodeType.Document:
          return reducedContent;
        case TipTapNodeType.Heading:
          const level = tipTapNode.attrs.level;
          const command =
            level === 1 ? "section*" : level === 2 ? "subsection*" : null;
          if (!level) {
            throw new Error(`No level for heading`);
          }
          return formatLaTeX(command, reducedContent) + "\n\n";
        case TipTapNodeType.Paragraph:
          return reducedContent + "\n\n";
        case TipTapNodeType.Text:
          let text = tipTapNode.text;
          if (tipTapNode.marks) {
            for (const mark of tipTapNode.marks) {
              switch (mark.type) {
                case TipTapMarkType.Bold:
                  text = formatLaTeX("textbf", text);
                  break;
                case TipTapMarkType.Italic:
                  text = formatLaTeX("emph", text);
                  break;
                default:
                  throw new Error(`Unknown mark type: '${tipTapNode.marks}'`);
              }
            }
          }
          return text;
        case TipTapNodeType.BulletList:
        case TipTapNodeType.OrderedList:
          const envName =
            tipTapNode.type === TipTapNodeType.BulletList
              ? "itemize"
              : "enumerate";
          return formatEnvironment(envName, reducedContent.trim()) + "\n\n";
        case TipTapNodeType.ListItem:
          return formatLaTeX("item", reducedContent.trim()) + "\n";
        case TipTapNodeType.HardBreak:
          return "\n";
        default:
          throw new Error(
            `Unknown node type: '${JSON.stringify(tipTapNode, null, 2)}'`
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

  private renderDimensionChart(dimension: Dimension) {
    const filePath = this.reportFileService.absolutePath(
      `dimension-chart-${dimension.id}.pdf`
    );
    debug("renderDimensionChart %O to %s", dimension, filePath);
    this.visualizationService.visualizeDimension(dimension, filePath);
    return formatCenter(formatLaTeX("includegraphics", filePath));
  }

  private renderPredictions(predictions: Prediction[]) {
    const filePath = this.reportFileService.absolutePath("predictions.pdf");
    debug("renderPredictions %O to %s", filePath);

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

  private static renderDemographics(
    groupDemographics: GroupDemographics
  ): string {
    const earliest = localeDate(groupDemographics.earliestResponse);
    const latest = localeDate(groupDemographics.latestResponse);
    const table = `
    \\begin{tabular}{ll}
    \\toprule
    Number of responses & ${groupDemographics.responseCount} \\\\
    Earliest response & ${earliest} \\\\
    Latest response & ${latest} \\\\
    \\bottomrule
    \\end{tabular}
    `;
    return formatCenter(table);
  }

  private renderScriptureEngagementCounts(
    predictionCounts: PredictionCount[]
  ): string {
    const filePath = this.reportFileService.absolutePath(
      "prediction-counts.pdf"
    );
    debug(
      "renderScriptureEngagementCounts %O to %s",
      predictionCounts,
      filePath
    );
    this.visualizationService.visualizePredictionCounts(
      predictionCounts,
      filePath
    );
    return formatCenter(
      formatLaTeX("includegraphics", filePath, "width=\\textwidth")
    );
  }

  private static renderDocument(renderedElements: string[]) {
    return `
    \\documentclass[11pt]{article}
    
    \\usepackage{booktabs}
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

  private async renderAllElements(params: RenderParameters) {
    const renderedElements: string[] = [];

    for (const letterElement of params.letter.letterElements) {
      renderedElements.push(
        formatComment(
          `${letterElement.letterElementType.key} (ID ${letterElement.id})`
        )
      );
      debug("render element %O", letterElement);
      switch (letterElement.letterElementType.key) {
        case "boilerplate-text":
          renderedElements.push(WriterService.renderBoilerplate(letterElement));
          break;
        case "demographics":
          renderedElements.push(
            WriterService.renderDemographics(params.groupDemographics)
          );
          break;
        case "dimension-chart":
          const dimension: Dimension = _.find(
            params.dimensions,
            (dim) => dim.id === letterElement.surveyDimension.id
          );
          debug("selected dimension %O", dimension);
          renderedElements.push(this.renderDimensionChart(dimension));
          break;
        case "image":
          renderedElements.push(this.renderImage(letterElement));
          break;
        case "scripture-engagement-count":
          renderedElements.push(
            this.renderScriptureEngagementCounts(params.predictionCounts)
          );
          break;
        case "scripture-engagement-prediction":
          renderedElements.push(this.renderPredictions(params.predictions));
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

  private async runLaTeX(renderedElements: string[]) {
    // Set up paths.
    const texFileName = "report.tex";
    const texFilePath = this.reportFileService.absolutePath(texFileName);
    const pdfFileName = "report.pdf";
    const pdfAbsolutePath = this.reportFileService.absolutePath(pdfFileName);

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
        cwd: this.reportFileService.absoluteDir,
      });
      debug("ran LaTeX %O", result);
    } catch (errorResult) {
      debug("failed to run LaTeX %O", errorResult.shortMessage);
      throw new Error("FAILED TO RUN LaTeX");
    }

    const writerOutput = WriterService.constructOutput(
      true,
      "Report created successfully",
      pdfFileName,
      this.reportFileService.relativePath(pdfFileName),
      pdfAbsolutePath
    );

    debug("writer output %O", writerOutput);
    return writerOutput;
  }

  async renderIndividualLetter(letter: Letter, surveyResponseId: number) {
    debug("individual letter %O for response %d", letter, surveyResponseId);

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

    await this.setWorkingDir(
      surveyResponse.survey.id,
      SurveyRespondentType.Individual,
      surveyResponse.id
    );

    const renderedElements = await this.renderAllElements({
      letter,
      dimensions,
      predictions,
    });

    renderedElements.push(
      WriterService.renderResponseDetails([
        ["Response ID", surveyResponse.id],
        ["Email", formatVerbatim(surveyResponse.email)],
      ])
    );

    return await this.runLaTeX(renderedElements);
  }

  async renderGroupLetter(letter: Letter, groupId: number) {
    debug("letter %O for group %d", letter, groupId);

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

    const predictionCounts =
      await this.surveyAnalyticsService.countPredictionsPerGroup(group.id);

    await this.setWorkingDir(
      group.survey.id,
      SurveyRespondentType.Group,
      group.id
    );

    const groupDemographics: GroupDemographics =
      await this.groupService.demographics(group.id);
    debug("demographics %O", groupDemographics);

    const renderedElements = await this.renderAllElements({
      letter,
      dimensions,
      predictions,
      predictionCounts,
      groupDemographics,
    });

    renderedElements.push(
      WriterService.renderResponseDetails([
        ["Group ID", group.id],
        ["Group Code", group.codeWord],
        ["Admin Email", formatVerbatim(group.adminEmail)],
      ])
    );

    return await this.runLaTeX(renderedElements);
  }

  async renderLetter(letterId: number, responseOrGroupId: number) {
    // Fetch the letter.  There _should_ only be one type
    // per letter, but make sure.
    const letter = await this.letterService.readOne(letterId);
    const uniqueTypes = _.uniqBy(letter.surveyLetters, "letterTypeId");
    if (uniqueTypes.length !== 1) {
      throw new Error(
        `Invalid letter types for letter ${letterId}: ${JSON.stringify(
          letter.surveyLetters
        )}`
      );
    }

    // Grab the type from an arbitrary letter and render away.
    const typeKey = letter.surveyLetters[0].letterType.key;
    switch (typeKey) {
      // FIXME - Eliminate magic strings.
      case "individual":
        return this.renderIndividualLetter(letter, responseOrGroupId);
      case "group":
        return this.renderGroupLetter(letter, responseOrGroupId);
      default:
        throw new Error(`Invalid letter type: '${typeKey}'`);
    }
  }
}
