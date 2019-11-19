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

class SurveyItemResponse {
  value: number;
  label: string;
}

class SurveyItem {
  id: number;
  qualtricsId: string;
  qualtricsText: string;
  response: SurveyItemResponse;
}

class SurveyIndex {
  id: number;
  abbreviation: string;
  title: string;
  surveyItems: Map<number, SurveyItem>[];
}

class SurveyDimension {
  id: number;
  title: string;
  useForPredictions: boolean;
  surveyIndices: Map<number, SurveyIndex>;

  constructor() {
    this.surveyIndices = new Map([]);
  }

  public addIndex(index: SurveyIndex) {
    if (this.surveyIndices.has(index.id)) {
      throw Error(`Already have index '${index}'`);
    }
    this.surveyIndices.set(index.id, index);
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

  private processResponses(itemResponses: SurveyItemResponse[]) {}

  render(
    letter: Letter,
    surveyResponse: SurveyResponse
  ): Promise<LetterWriterOutput> {
    // console.log("LETTER", JSON.stringify(letter, null, 2));
    // console.log("RESPONSE", JSON.stringify(surveyResponse, null, 2));

    for (let dim of surveyResponse.survey.surveyDimensions) {
      console.log(`DIM (${dim.id}) ${dim.title}`);
      for (let index of dim.surveyIndices) {
        console.log(`  IDX (${index.id}), ${index.title}`);
        for (let pte of index.predictionTableEntries) {
          console.log(`    PTE (${pte.id}) ${pte.practice.title}`);
        }
        for (let item of index.surveyItems) {
          console.log(
            `    ITEM (${item.id} ${item.qualtricsId}) ${item.qualtricsText}`
          );
          for (let response of item.surveyItemResponses) {
            console.log(
              `      RESP (${response.id})-${response.label}, ${response.value}`
            );
          }
        }
      }
    }

    this.processResponses(surveyResponse.surveyItemResponses);

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
