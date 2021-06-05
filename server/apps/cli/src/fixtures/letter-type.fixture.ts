import { AbstractFixture } from "./abstract-fixture";
import { LetterTypeModel } from "../models/letter-type.model";
import { LetterElementTypeModel } from "../models/letter-element-type.model";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("letter");

export class LetterTypeFixture extends AbstractFixture {
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
          key: "individual",
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
          key: "group",
          description: "Group Letter",
          // These element types are identical to the individual letter.
          // This was not always the case, and I'm leaving this in place
          // in case it is again in the future.
          elementTypes: [
            { "#ref": "boilerplate-text" },
            { "#ref": "scripture-engagement-prediction" },
            { "#ref": "dimension-chart" },
            { "#ref": "image" },
          ],
        },
      ],
      { allowRefs: true }
    );
  }
}
