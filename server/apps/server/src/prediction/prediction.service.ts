import { Injectable } from "@nestjs/common";
import {
  PredictionTableEntry,
  PredictionTableEntryReplaceInput,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeUpdateInput,
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OldBaseService } from "../shared/old-base.service";
import {
  PredictionTable,
  PredictionTableCreateInput,
  PredictionTableUpdateInput,
} from "@server/src/prediction/entities/prediction-table";

@Injectable()
export class PredictionService extends OldBaseService {
  constructor(
    @InjectRepository(PredictionTableEntry)
    private readonly predictionTableEntryRepo: Repository<PredictionTableEntry>,
    @InjectRepository(ScriptureEngagementPractice)
    private readonly scriptureEngagementRepo: Repository<ScriptureEngagementPractice>
  ) {
    super();
  }

  replacePredictionTableEntries(
    replaceInput: PredictionTableEntryReplaceInput
  ): Promise<PredictionTableEntry[]> {
    return this.predictionTableEntryRepo.manager.transaction(
      async (manager) => {
        const predictionTableEntryRepo =
          manager.getRepository(PredictionTableEntry);

        // Insert the replacement entries.
        const newEntries: PredictionTableEntry[] = [];
        for (const inputEntry of replaceInput.entries) {
          const entry = predictionTableEntryRepo.create({
            ...inputEntry,
          });
          newEntries.push(await predictionTableEntryRepo.save(entry));
        }

        return newEntries;
      }
    );
  }

  async updateScriptureEngagementPractice(
    updateInput: ScriptureEngagementPracticeUpdateInput
  ): Promise<ScriptureEngagementPractice> {
    const practice = await this.scriptureEngagementRepo.preload(updateInput);
    return this.scriptureEngagementRepo.save(practice);
  }
}

@Injectable()
export class PredictionTableService {
  constructor(
    @InjectRepository(PredictionTable)
    private readonly predictionTableRepo: Repository<PredictionTable>
  ) {}

  createPredictionTable(createInput: PredictionTableCreateInput) {
    return this.predictionTableRepo.save(
      this.predictionTableRepo.create(createInput)
    );
  }

  readPredictionTables() {
    return this.predictionTableRepo.find();
  }

  updatePredictionTable(updateInput: PredictionTableUpdateInput) {
    return this.predictionTableRepo
      .preload(updateInput)
      .then((result) => this.predictionTableRepo.save(result));
  }

  deletePredictionTable(id: number) {
    return this.predictionTableRepo
      .delete(id)
      .then((result) => result.affected);
  }
}
