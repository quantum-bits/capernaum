import { CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "../../shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";
import { LetterElement } from "@server/src/letter/entities";

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

  @Field({ description: "Date this image added" })
  @CreateDateColumn()
  created: Date;

  @Field({ description: "Date this image updated" })
  @UpdateDateColumn()
  updated: Date;

  @Field(() => [LetterElement], {
    description: "Letter elements that use this image",
  })
  @OneToMany(() => LetterElement, (elt) => elt.image)
  letterElements: LetterElement[];

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
