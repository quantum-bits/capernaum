import { AbstractFixture } from "./abstract-fixture";
import { LetterTypeModel } from "./models/letter-type.model";
import { LetterElementTypeModel } from "./models/letter-element-type.model";

export class LetterTypeFixture extends AbstractFixture {
  async delete() {
    console.log("DELETE LETTER TYPES");
    await LetterTypeModel.query().delete();
    console.log("DELETE LETTER ELEMENT TYPES");
    await LetterElementTypeModel.query().delete();
  }

  insert() {
    return LetterTypeModel.query().insertGraph(
      [
        {
          key: "INDIVIDUAL",
          description: "Individual Letter",
          elementTypes: [
            {
              "#id": "boilerplate",
              key: "boilerplate",
              description: "Boilerplate Text",
            },
            {
              key: "boolean-calculation-results",
              description: "Boolean Calculation Results",
            },
            {
              "#id": "chart",
              key: "chart",
              description: "Bar Chart",
            },
            {
              "#id": "footer",
              key: "footer",
              description: "Footer (End of Letter)",
            },
            {
              "#id": "header",
              key: "header",
              description: "Header (Top of Letter)",
            },
            {
              "#id": "image",
              key: "image",
              description: "Image",
            },
          ],
        },
        {
          key: "GROUP",
          description: "Group Letter",
          elementTypes: [
            { "#ref": "boilerplate" },
            { "#ref": "chart" },
            {
              key: "demographics-chart",
              description: "Demographics Chart",
            },
            { "#ref": "footer" },
            { "#ref": "header" },
            { "#ref": "image" },
          ],
        },
      ],
      { allowRefs: true }
    );
  }
}
