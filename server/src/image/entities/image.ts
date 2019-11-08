import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { AbstractEntity } from "../../shared/abstract-entity";

@Entity()
@ObjectType()
export class Image extends AbstractEntity {
  @Field()
  @Column()
  originalName: string;

  @Field()
  @Column()
  mimeType: string;

  @Field()
  @Column()
  uuid: string;

  @Field()
  @Column({ default: "Not yet set" })
  title: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;
}

@InputType()
export class ImageUpdateInput {
  @Field() serverId: string;
  @Field() title: string;
}
