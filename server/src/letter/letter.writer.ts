import { ConfigureOptions, Environment, FileSystemLoader } from "nunjucks";
import { Letter, LetterWriterOutput } from "./entities";
import { exec } from "child_process";
import { writeFile } from "fs";
import { format, join } from "path";
import { SurveyResponse } from "../survey/entities";

const WORKING_DIR = "/Users/tom/Scratch";

const VALID_ELEMENT_TYPES = [
  "boilerplate",
  "boolean-calculation-results",
  "footer",
  "header",
  "chart",
  "image"
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

  private tab(n: number, msge: string) {
    return "  ".repeat(n) + msge;
  }

  private dumpSurveyResponse(surveyResponse: SurveyResponse): void {
    for (let dim of surveyResponse.survey.surveyDimensions) {
      console.log(`DIM (${dim.id}) ${dim.title}`);

      for (let index of dim.surveyIndices) {
        console.log(
          this.tab(
            1,
            `IDX (${index.id}), ${index.title} => ${index.meanResponse()}`
          )
        );

        for (let pte of index.predictionTableEntries) {
          console.log(this.tab(2, `PTE (${pte.id}) ${pte.practice.title}`));
        }

        for (let item of index.surveyItems) {
          console.log(
            this.tab(
              3,
              `ITEM (${item.id}-${item.qualtricsId}) ${item.qualtricsText}`
            )
          );

          for (let response of item.surveyItemResponses) {
            console.log(
              this.tab(
                4,
                `RESP (${response.id}) ${response.label}, ${response.value}`
              )
            );
          }
        }
      }
    }
  }

  render(
    letter: Letter,
    surveyResponse: SurveyResponse
  ): Promise<LetterWriterOutput> {
    // console.log("LETTER", JSON.stringify(letter, null, 2));
    // console.log("RESPONSE", JSON.stringify(surveyResponse, null, 2));
    this.dumpSurveyResponse(surveyResponse);

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
