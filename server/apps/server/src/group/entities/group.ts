import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Survey, SurveyResponse } from "../../survey/entities";
import { AbstractEntity } from "../../shared/abstract-entity";
import { GroupType } from ".";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class Group extends AbstractEntity {
  @FieldColumn("Group name")
  name: string;

  @Field(() => GroupType)
  @ManyToOne(() => GroupType, (groupType) => groupType.groups)
  type: GroupType;
  @Column("integer") typeId: number;

  @FieldColumn("Name for 'other' type ", { nullable: true })
  otherTypeName?: string;

  @Field({ description: "Date when survey created" })
  @CreateDateColumn()
  created: string;

  @FieldColumn("Date when survey closes")
  closedAfter: string;

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

  @ManyToOne(() => Survey, (survey) => survey.groups)
  @Field(() => Survey)
  survey: Survey;
  @Column("integer") surveyId: number;

  @OneToMany(() => SurveyResponse, (sr) => sr.group)
  @Field(() => [SurveyResponse], {
    description: "Responses by this group",
    nullable: true,
  })
  surveyResponses: SurveyResponse[];
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
  closedAfter: string;

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
  closedAfter?: string;

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
