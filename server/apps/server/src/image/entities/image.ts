import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "../../shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class Image extends AbstractEntity {
  @FieldColumn("Original name of image file")
  originalName: string;

  @FieldColumn("MIME encoding for this image")
  mimeType: string;

  @FieldColumn("Internal unique ID")
  uuid: string;

  @FieldColumn("Image title from user", { default: "Not yet set" })
  title: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;

  private static extensionFromMimeType(mimeType: string) {
    return mimeType.replace(/\//g, ".");
  }

  fileName(): string {
    return `${this.uuid}-${Image.extensionFromMimeType(this.mimeType)}`;
  }
}

@InputType()
export class ImageUpdateInput {
  @Field(() => Int) id: number;
  @Field() title: string;
}
