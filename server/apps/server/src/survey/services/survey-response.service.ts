import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import {
  ResponseSummary,
  SurveyItemResponse,
  SurveyResponse,
} from "@server/src/survey/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("response");

@Injectable()
export class SurveyResponseService extends BaseService<SurveyResponse> {
  constructor(
    @InjectRepository(SurveyResponse)
    private readonly repo: Repository<SurveyResponse>
  ) {
    super(repo);
  }

  readOne(id: number) {
    return this.repo.findOne(id, {
      relations: ["survey", "surveyItemResponses"],
    });
  }

  readForAnalysis(id: number) {
    return this.repo.findOne(id, {
      relations: [
        "survey",
        "surveyItemResponses",
        "surveyItemResponses.surveyItems",
      ],
    });
  }

  readComplete(responseId: number) {
    debug("get complete response %d", responseId);

    return this.repo
      .createQueryBuilder("surveyResponse")
      .innerJoinAndSelect("surveyResponse.survey", "survey")
      .innerJoinAndSelect("survey.surveyDimensions", "dimensions")
      .innerJoinAndSelect("dimensions.surveyIndices", "indices")
      .innerJoinAndSelect("indices.surveyItems", "items")
      .innerJoinAndSelect("items.surveyItemResponses", "responseItems")
      .leftJoinAndSelect("indices.predictionTableEntries", "tableEntries")
      .leftJoinAndSelect("tableEntries.practice", "practice")
      .where("surveyResponse.id = :responseId", { responseId })
      .andWhere("responseItems.surveyResponseId = :responseId", {
        responseId,
      })
      .getOne();
  }

  static async _deleteHelper(manager: EntityManager, surveyResponseId: number) {
    // Delete responses to each question.
    await manager.delete(SurveyItemResponse, {
      surveyResponseId,
    });

    return manager.delete(SurveyResponse, {
      id: surveyResponseId,
    });
  }

  async delete(surveyResponseId: number) {
    return this.repo.manager.transaction(async (manager) => {
      const result = await SurveyResponseService._deleteHelper(
        manager,
        surveyResponseId
      );
      return result.affected;
    });
  }
}
