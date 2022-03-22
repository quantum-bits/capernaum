import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import {
  SurveyItemResponse,
  SurveyResponse,
} from "@server/src/survey/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyService } from "@server/src/survey/services/survey.service";

const debug = getDebugger("response");

@Injectable()
export class SurveyResponseService extends BaseService<SurveyResponse> {
  constructor(
    private readonly surveyService: SurveyService,
    @InjectRepository(SurveyResponse)
    private readonly repo: Repository<SurveyResponse>
  ) {
    super(repo);
  }

  private alwaysRelate = [
    "survey",
    "survey.surveyLetters",
    "survey.surveyLetters.letterType",
    "surveyItemResponses",
  ];

  readAll() {
    return this.repo.find({ relations: this.alwaysRelate });
  }

  readOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: this.alwaysRelate,
    });
  }

  async readSome(surveyId: number, groupId?: number) {
    debug("readSome(%d, %d)", surveyId, groupId);
    const query = this.repo
      .createQueryBuilder("sr")
      .innerJoinAndSelect("sr.survey", "s")
      .innerJoinAndSelect("s.surveyLetters", "sl")
      .innerJoinAndSelect("sl.letter", "l")
      .innerJoinAndSelect("sl.letterType", "lt")
      .where("s.id = :sid", { sid: surveyId });

    if (groupId) {
      query
        .innerJoin("sr.group", "grp")
        .where("grp.id = :gid", { gid: groupId });
    }

    return query.getMany();
  }

  readForAnalysis(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: {
        survey: true,
        surveyItemResponses: {
          surveyItem: true,
        },
      },
    });
  }

  // TODO - Verify this!
  findByGroupId(groupId: number) {
    return this.repo.find({
      where: {
        group: { id: groupId },
      },
    });
  }

  readComplete(responseId: number) {
    debug("get complete response %d", responseId);

    return (
      this.repo
        .createQueryBuilder("surveyResponse")
        .innerJoinAndSelect("surveyResponse.survey", "survey")
        .innerJoinAndSelect("survey.surveyDimensions", "dimensions")
        .innerJoinAndSelect("dimensions.surveyIndices", "indices")
        .innerJoinAndSelect("indices.surveyItems", "items")
        .innerJoinAndSelect("items.surveyItemResponses", "responseItems")
        .leftJoinAndSelect("indices.scriptureEngagementPractices", "practices")
        // .leftJoinAndSelect("practices.practice", "practice")
        .where("surveyResponse.id = :responseId", { responseId })
        .andWhere("responseItems.surveyResponseId = :responseId", {
          responseId,
        })
        .getOne()
    );
  }

  static async _deleteHelper(manager: EntityManager, surveyResponseId: number) {
    // Delete item responses.
    await manager
      .createQueryBuilder()
      .delete()
      .from(SurveyItemResponse)
      .where("surveyResponseId = :id", { id: surveyResponseId })
      .execute();

    return manager.delete(SurveyResponse, surveyResponseId);
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
