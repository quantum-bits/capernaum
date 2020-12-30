import { Injectable } from "@nestjs/common";
import faker from "faker";
import { CodeWord, Group, GroupCreateInput } from "@server/src/group/entities";
import { SurveyFabricatorService } from "@server/src/fabricator/survey-fabricator.service";
import {
  AbstractFabricatorService,
  FabricatedData,
} from "@server/src/fabricator/abstract-fabricator.service";

@Injectable()
export class GroupFabricatorService extends AbstractFabricatorService {
  fabricateGroup(surveyId: number): FabricatedData {
    const fields = {
      name: faker.company.companyName(),
      type: faker.random.arrayElement([
        "Sunday School",
        "Small Group",
        "Bible Study",
      ]),
      closedAfter: faker.date.soon(14).toISOString(),
      adminFirstName: faker.name.firstName(),
      adminLastName: faker.name.lastName(),
      adminEmail: faker.internet.email(),
      codeWord: CodeWord.generate(),
      surveyId: surveyId,
    };
    this.verifyColumns(Group, fields);
    return fields;
  }

  create(surveyId: number): Promise<Group> {
    return this.entityMgr.save(
      this.entityMgr.create(Group, this.fabricateGroup(surveyId))
    );
  }
}
