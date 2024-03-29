import { AbstractFixture } from "./abstract-fixture";
import { LetterTypeModel } from "../models/letter-type.model";
import { LetterElementTypeModel } from "../models/letter-element-type.model";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyRespondentType } from "@server/src/survey/survey.types";

const debug = getDebugger("fixture:letter-type");

export class LetterTypesFixture extends AbstractFixture {
  async delete() {
    debug("Delete letter types");
    await LetterTypeModel.query().delete();
    debug("Delete letter element types");
    await LetterElementTypeModel.query().delete();
  }

  /**
   * The `key`s for each `elementType` _must_ match the cases in `WriterService.renderAllElements`.
   */
  insert() {
    debug("Insert letter types");
    return LetterTypeModel.query().insertGraph(
      [
        {
          key: SurveyRespondentType.Individual,
          description: "Individual Letter",
          elementTypes: [
            {
              "#id": "boilerplate-text",
              key: "boilerplate-text",
              description: "Boilerplate Text",
            },
            {
              "#id": "scripture-engagement-prediction",
              key: "scripture-engagement-prediction",
              description: "Scripture Engagement Prediction",
            },
            {
              "#id": "dimension-chart",
              key: "dimension-chart",
              description: "Dimension Chart",
            },
            {
              "#id": "image",
              key: "image",
              description: "Image",
            },
          ],
        },
        {
          key: SurveyRespondentType.Group,
          description: "Group Letter",
          elementTypes: [
            { "#ref": "boilerplate-text" },
            { "#ref": "scripture-engagement-prediction" },
            { "#ref": "dimension-chart" },
            { "#ref": "image" },
            {
              "#id": "scripture-engagement-count",
              key: "scripture-engagement-count",
              description: "Scripture Engagement Counts",
            },
            {
              "#id": "demographics",
              key: "demographics",
              description: "Group Demographics",
            },
          ],
        },
      ],
      { allowRefs: true }
    );
  }
}
