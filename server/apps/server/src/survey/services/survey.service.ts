import { Injectable } from "@nestjs/common";
import {
  Survey,
  SurveyCreateInput,
  SurveyItem,
  SurveyUpdateInput,
} from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WhichItems } from "../survey.types";
import { getDebugger } from "@helpers/debug-factory";
import { GroupService } from "@server/src/group/group.service";
import { BaseService } from "@server/src/shared/base.service";

const debug = getDebugger("survey");

@Injectable()
export class SurveyService extends BaseService<Survey> {
  constructor(
    private readonly groupService: GroupService,

    @InjectRepository(Survey)
    private readonly repo: Repository<Survey>
  ) {
    super(repo);
  }

  construct(createInput: SurveyCreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  readAll() {
    return this.repo.find();
  }

  readOne(id: number) {
    return this.repo.findOne(id);
  }

  findByQualtricsId(qualtricsId: string): Promise<Survey> {
    return this.repo.findOne({ qualtricsId }, { relations: ["surveyItems"] });
  }

  resolveRelatedLetters(survey: Survey) {
    debug("Resolve letters for %O", survey);
    return this.resolveMany(survey, "letters");
  }

  resolveRelatedDimensions(survey: Survey) {
    return this.resolveMany(survey, "surveyDimensions");
  }

  resolveRelatedResponses(survey: Survey) {
    return this.resolveMany(survey, "surveyResponses");
  }

  resolveRelatedGroups(survey: Survey) {
    return this.resolveMany(survey, "surveyGroups");
  }

  resolveRelatedItems(
    survey: Survey,
    whichItems: WhichItems
  ): Promise<SurveyItem[]> {
    const allItems = this.resolveMany(survey, "surveyItems");

    switch (whichItems) {
      case WhichItems.All:
        return allItems;
      case WhichItems.WithIndex:
        return allItems.filter((item) => !!item.surveyIndexId);
      case WhichItems.WithoutIndex:
        return allItems.filter((item) => !item.surveyIndexId);
    }
  }

  update(updateInput: SurveyUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  async deconstruct(id: number) {
    return this.repo.manager.transaction(async (manager) => {
      await manager.delete(SurveyItem, { surveyId: id });
      const deleteResult = await manager.delete(Survey, id);
      return deleteResult.affected;
    });
  }
}
