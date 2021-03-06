import { CreateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Survey, SurveyResponse } from "../../survey/entities";
import { AbstractEntity } from "../../shared/abstract-entity";
import { GroupType } from ".";
import { FieldColumn } from "@server/src/decorators";
import { DateTime } from "luxon";
import numbro from "numbro";

@Entity()
@ObjectType()
export class Group extends AbstractEntity {
  @FieldColumn("Group name")
  name: string;

  @Field(() => GroupType)
  @ManyToOne(() => GroupType, (groupType) => groupType.groups)
  type: GroupType;

  @FieldColumn("Name for 'other' type ", { nullable: true })
  otherTypeName?: string;

  @Field({ description: "Date when survey created" })
  @CreateDateColumn()
  created: Date;

  @FieldColumn("Date when survey closes")
  closedAfter: Date;

  @FieldColumn("Group report sent", {
    type: "timestamp without time zone",
    nullable: true,
  })
  reportSent: Date;

  @FieldColumn("Group administrator first name")
  adminFirstName: string;

  @FieldColumn("Group administrator last name")
  adminLastName: string;

  @FieldColumn("Group administrator email address")
  adminEmail: string;

  @FieldColumn("Survey code word used by group")
  codeWord: string;

  @FieldColumn("Comments from administrator", { default: "" })
  adminComments: string;

  @FieldColumn("Planned invitee count", () => Int, {
    default: 1,
  })
  plannedInvitees: number;

  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.groups)
  survey: Survey;

  @Field(() => [SurveyResponse], {
    description: "Responses by this group",
    nullable: true,
  })
  @OneToMany(() => SurveyResponse, (sr) => sr.group)
  surveyResponses: SurveyResponse[];

  get isClosed() {
    return !!this.reportSent;
  }

  get daysRemaining() {
    if (this.isClosed) {
      return 0;
    }
    const now = DateTime.now();
    const closing = DateTime.fromJSDate(this.closedAfter);
    const days = closing.diff(now, "days").days;
    return numbro(days).format({ mantissa: 0, thousandSeparated: true });
  }
}

@InputType()
export class GroupCreateInput {
  @Field({ description: "Group name" })
  name: string;

  @Field(() => Int, { description: "Type of group" })
  typeId: number;

  @Field({ description: "Name for 'other' type ", nullable: true })
  otherTypeName?: string;

  @Field({ description: "Date when survey closes" })
  closedAfter: Date;

  @Field({ description: "Group administrator first name" })
  adminFirstName: string;

  @Field({ description: "Group administrator last name" })
  adminLastName: string;

  @Field({ description: "Group administrator email address" })
  adminEmail: string;

  @Field({ description: "Comments from administrator" })
  adminComments: string;

  @Field(() => Int, { description: "Planned invitee count" })
  plannedInvitees: number;

  @Field(() => Int)
  surveyId: number;
}

@InputType()
export class GroupUpdateInput implements Partial<Group> {
  @Field(() => Int)
  id: number;

  @Field({ description: "Group name", nullable: true })
  name?: string;

  @Field(() => Int, { description: "Type of group", nullable: true })
  typeId?: number;

  @Field({ description: "Name for 'other' type ", nullable: true })
  otherTypeName?: string;

  @Field({ description: "Date when survey closes", nullable: true })
  closedAfter?: Date;

  @Field({ description: "Group administrator first name", nullable: true })
  adminFirstName?: string;

  @Field({ description: "Group administrator last name", nullable: true })
  adminLastName?: string;

  @Field({ description: "Group administrator email address", nullable: true })
  adminEmail?: string;

  @Field({ description: "Survey code word used by group", nullable: true })
  codeWord?: string;

  @Field({ description: "Comments from administrator", nullable: true })
  adminComments?: string;

  @Field(() => Int, { description: "Planned invitee count", nullable: true })
  plannedInvitees?: number;

  @Field(() => Int, { nullable: true })
  surveyId?: number;
}
