import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import {
  SurveyDimension,
  SurveyDimensionCreateInput,
  SurveyDimensionDeleteOutput,
  SurveyDimensionUpdateInput,
} from "@server/src/survey/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SurveyService } from "@server/src/survey/services/survey.service";
import { SurveyIndexService } from "@server/src/survey/services/survey-index.service";

@Injectable()
export class SurveyDimensionService extends BaseService<SurveyDimension> {
  constructor(
    private readonly surveyService: SurveyService,

    @InjectRepository(SurveyDimension)
    private readonly repo: Repository<SurveyDimension>
  ) {
    super(repo);
  }

  async construct(createInput: SurveyDimensionCreateInput) {
    const survey = await this.surveyService.readOne(createInput.surveyId);
    return this.repo.save(
      this.repo.create({
        survey,
        title: createInput.title,
      })
    );
  }

  private alwaysRelate = {
    survey: true,
    surveyIndices: {
      surveyItems: true,
    },
  };

  readOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: this.alwaysRelate,
    });
  }

  readAll() {
    return this.repo.find({ relations: this.alwaysRelate });
  }

  resolveRelatedSurvey(surveyDimension: SurveyDimension) {
    return this.resolveOne(surveyDimension, "survey");
  }

  resolveRelatedIndices(surveyDimension: SurveyDimension) {
    return this.resolveMany(surveyDimension, "surveyIndices");
  }

  update(updateInput: SurveyDimensionUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result))
      .then(() => this.readOne(updateInput.id));
  }

  async delete(dimensionId: number): Promise<SurveyDimensionDeleteOutput> {
    return this.repo.manager.transaction(async (manager) => {
      const surveyDimensionRepo = manager.getRepository(SurveyDimension);

      const dimension = await surveyDimensionRepo.findOneOrFail({
        where: { id: dimensionId },
        relations: { surveyIndices: true },
      });

      const dimensionDeleteOutput: SurveyDimensionDeleteOutput = {
        deletedDimensionId: dimensionId,
        deletedIndexIds: [],
        deletedItemIds: [],
      };

      for (const index of dimension.surveyIndices) {
        const indexDeleteOutput = await SurveyIndexService._deleteHelper(
          manager,
          index.id
        );
        dimensionDeleteOutput.deletedIndexIds.push(
          indexDeleteOutput.deletedIndexId
        );
        dimensionDeleteOutput.deletedItemIds =
          dimensionDeleteOutput.deletedItemIds.concat(
            indexDeleteOutput.deletedItemIds
          );
      }

      await surveyDimensionRepo.remove(dimension);

      return dimensionDeleteOutput;
    });
  }
}
