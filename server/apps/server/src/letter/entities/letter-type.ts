import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElementType } from "@server/src/letter/entities/letter-element-type";

@Entity()
@ObjectType()
export class LetterType extends AbstractEntity {
  @Field()
  @Column()
  key: string;

  @Field()
  @Column()
  description: string;

  @Field((returns) => [LetterElementType])
  @ManyToMany(
    (type) => LetterElementType,
    (letterElementType) => letterElementType.letterTypes
  )
  letterElementTypes: LetterElementType[];
}

@InputType()
export class LetterTypeCreateInput {
  @Field({ description: "Human readable key" }) key: string;

  @Field({ description: "Description of this type" }) description: string;
}

@InputType()
export class LetterTypeUpdateInput {
  @Field(() => Int) id: number;

  @Field({ description: "Human readable key", nullable: true }) key?: string;

  @Field({ description: "Description of this type", nullable: true })
  description?: string;
}
