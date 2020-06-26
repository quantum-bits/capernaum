import { getRepository } from "typeorm";
import {
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyItemResponse,
  SurveyResponse,
} from "../apps/server/src/survey/entities";

const NUM_DIMENSIONS = 3;
const NUM_INDICES = 4;
const NUM_ITEMS = 6;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function makeFakeSurvey() {
  const surveyRepo = getRepository(Survey);
  const survey = await surveyRepo.save(
    surveyRepo.create({
      qualtricsId: "Fake ID",
      qualtricsName: "My Fake Survey",
      qualtricsModDate: "2019-12-24",
    })
  );

  const surveyResponseRepo = getRepository(SurveyResponse);
  const surveyResponse = await surveyResponseRepo.save(
    surveyResponseRepo.create({
      survey: survey,
      email: "alpha@beta.com",
      groupCode: "Groupie",
      qualtricsResponseId: "Qualtrics Response ID",
      startDate: "2019-12-24",
      endDate: "2019-12-24",
      status: 1,
      ipAddress: "127.0.0.1",
      progress: 17,
      duration: 42,
      finished: 1,
      recordedDate: "2019-12-24",
      latitude: "0",
      longitude: "0",
    })
  );

  const surveyDimensionRepo = getRepository(SurveyDimension);
  for (let dimIdx = 0; dimIdx < NUM_DIMENSIONS; dimIdx++) {
    const surveyDimension = await surveyDimensionRepo.save(
      surveyDimensionRepo.create({
        survey: survey,
        title: `Survey Dimension ${dimIdx}`,
        sequence: dimIdx,
      })
    );

    const surveyIndexRepo = getRepository(SurveyIndex);
    for (let indexIdx = 0; indexIdx < NUM_INDICES; indexIdx++) {
      const surveyIndex = await surveyIndexRepo.save(
        surveyIndexRepo.create({
          surveyDimension: surveyDimension,
          abbreviation: `Survey Index Abbrev ${indexIdx}`,
          title: `Survey Index ${indexIdx}`,
          useForPredictions: true,
        })
      );

      const surveyItemRepo = getRepository(SurveyItem);
      const surveyItemResponseRepo = getRepository(SurveyItemResponse);
      for (let itemIdx = 0; itemIdx < NUM_ITEMS; itemIdx++) {
        const qid = `QID-${dimIdx}-${indexIdx}-${itemIdx}`;
        const surveyItem = await surveyItemRepo.save(
          surveyItemRepo.create({
            survey: survey,
            surveyIndex: surveyIndex,
            sequence: itemIdx,
            qualtricsId: qid,
            qualtricsText: `Text for question ${qid}`,
          })
        );

        const value = getRandomIntInclusive(1, 7);
        await surveyItemResponseRepo.save(
          surveyItemResponseRepo.create({
            surveyResponse: surveyResponse,
            surveyItem: surveyItem,
            value: value,
            label: `Text label for value ${value}`,
          })
        );
      }
    }
  }
}

export default makeFakeSurvey;
