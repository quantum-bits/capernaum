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
import faker from "faker";

@Entity()
@ObjectType()
export class Group extends AbstractEntity {
  @Field({ description: "Group name" })
  @Column()
  name: string;

  @Field({ description: "Type of group" })
  @Column()
  type: string;

  @Field({ description: "Date when survey created" })
  @CreateDateColumn()
  created: string;

  @Field({ description: "Date when survey closes" })
  @Column()
  closedAfter: string;

  @Field({ description: "Group administrator first name" })
  @Column()
  adminFirstName: string;

  @Field({ description: "Group administrator last name" })
  @Column()
  adminLastName: string;

  @Field({ description: "Group administrator email address" })
  @Column()
  adminEmail: string;

  @Field({ description: "Survey code word used by group" })
  @Column()
  codeWord: string;

  @Column("integer") surveyId: number;
  @ManyToOne(() => Survey, (survey) => survey.groups)
  @Field(() => Survey)
  survey: Survey;

  @OneToMany((type) => SurveyResponse, (sr) => sr.group)
  @Field(() => [SurveyResponse], { description: "Responses by this group" })
  surveyResponses: SurveyResponse[];
}

@InputType()
export class GroupCreateInput {
  @Field({ description: "Group name" })
  name: string;

  @Field({ description: "Type of group" })
  type: string;

  @Field({ description: "Date when survey closes" })
  closedAfter: string;

  @Field({ description: "Group administrator first name" })
  adminFirstName: string;

  @Field({ description: "Group administrator last name" })
  adminLastName: string;

  @Field({ description: "Group administrator email address" })
  adminEmail: string;

  @Field({ description: "Survey code word used by group" })
  codeWord: string;

  @Field((type) => Int)
  surveyId: number;
}

@InputType()
export class GroupUpdateInput implements Partial<Group> {
  @Field(() => Int)
  id: number;

  @Field({ description: "Group name", nullable: true })
  name?: string;

  @Field({ description: "Type of group", nullable: true })
  type?: string;

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

  @Field((type) => Int, { nullable: true })
  surveyId?: number;
}
