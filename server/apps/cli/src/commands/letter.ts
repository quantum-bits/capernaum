import { SurveyRespondentType } from "@server/src/survey/survey.types";
import { WriterOutput } from "@server/src/writer/entities";
import NestContext from "@common/cli/src/nest-helpers";
import { WriterService } from "@server/src/writer/writer.service";
import { printPretty, printTable } from "@helpers/formatting";
import { LetterService } from "@server/src/letter/letter.service";
import * as _ from "lodash";

export async function renderLetter(
  letterPk: number,
  groupOrResponsePk: number,
  respondentType: SurveyRespondentType
) {
  let writerOutput: WriterOutput = null;

  const nestContext = new NestContext();
  const writerService = await nestContext.get(WriterService);
  const letterService = await nestContext.get(LetterService);

  const letter = await letterService.readOne(letterPk);

  if (respondentType === SurveyRespondentType.Individual) {
    writerOutput = await writerService.renderIndividualLetter(
      letter,
      groupOrResponsePk
    );
  } else {
    writerOutput = await writerService.renderGroupLetter(
      letter,
      groupOrResponsePk
    );
  }
  await nestContext.close();

  printPretty(writerOutput);
}

export async function listLetters() {
  const nestContext = new NestContext();
  const letterService = await nestContext.get(LetterService);
  const letters = await letterService.readAll();
  await nestContext.close();

  const headers = ["Ltr ID", "Description", "Elt ID", "Seq", "Description"];
  const data = _.flatMap(letters, (letter) =>
    _.map(
      letter.letterElements.sort((a, b) => a.sequence - b.sequence),
      (elt, idx) => [
        idx === 0 ? letter.id : "",
        idx === 0 ? letter.description : "",
        elt.id,
        elt.sequence,
        elt.letterElementType.description,
      ]
    )
  );

  printPretty(letters);
  printTable(headers, data);
}
