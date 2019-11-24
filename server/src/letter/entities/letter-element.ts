import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Letter } from "./letter";
import { LetterElementType } from "./letter-element-type";
import { SurveyDimension } from "../../survey/entities";
import { DEFAULT_QUILL_DELTA } from "../letter.types";
import { Image } from "../../image/entities";
import * as assert from "assert";
import { formatLaTeX, LineBuffer } from "../letter.writer";

@Entity()
@ObjectType()
export class LetterElement extends AbstractEntity {
  @Field(type => Int)
  @Column("int")
  sequence: number;

  @Column({ type: "text", default: DEFAULT_QUILL_DELTA })
  @Field({ nullable: true })
  textDelta?: string;

  @Column("int", { nullable: true }) imageId?: number;
  @Field(type => Image, { nullable: true })
  @OneToOne(type => Image, { nullable: true })
  @JoinColumn()
  image?: Image;

  @Column("int")
  letterId: number;
  @ManyToOne(type => Letter, letter => letter.letterElements)
  @Field(type => Letter)
  letter: Letter;

  @Column("int") letterElementTypeId: number;
  @ManyToOne(type => LetterElementType)
  @Field(type => LetterElementType)
  letterElementType: LetterElementType;

  @Column({ type: "int", nullable: true }) surveyDimensionId: number;
  @ManyToOne(type => SurveyDimension, { nullable: true })
  @Field(type => SurveyDimension, { nullable: true })
  surveyDimension?: SurveyDimension;

  renderImage() {
    assert.strictEqual(this.letterElementType.key, "image");
    console.log("RENDER IMAGE");
    return `IMAGE '${this.image.fileName()}'`;
  }

  renderBoilerplate() {
    assert.strictEqual(this.letterElementType.key, "boilerplate");
    console.log("RENDER BOILERPLATE");

    const quillDelta = JSON.parse(this.textDelta);
    const lineBuffer = new LineBuffer();

    for (let op of quillDelta.ops) {
      assert.ok(op.hasOwnProperty("insert"));
      // console.log(JSON.stringify(op, null, 2));

      if (op.insert === "\n") {
        // Insert op that is just a newline.
        assert.ok(op.hasOwnProperty("attributes"));
        let wrapper = "";
        if (op.attributes.hasOwnProperty("header")) {
          if (op.attributes.header === 1) {
            wrapper = "section";
          } else if (op.attributes.header === 2) {
            wrapper = "subsection";
          } else {
            throw Error(`Bogus attributes ${op.attributes}`);
          }
        }
        if (op.attributes.hasOwnProperty("list")) {
          wrapper = "item";
        }
        lineBuffer.wrapCurrentLine(wrapper);
        lineBuffer.flushCurrentLine();
      } else {
        // Insert op that is not just a newline.
        if (op.hasOwnProperty("attributes")) {
          // More than a newline and has attributes.
          for (let attribute of Object.keys(op.attributes)) {
            switch (attribute) {
              case "bold":
                lineBuffer.appendToCurrentLine(
                  formatLaTeX("textbf", op.insert)
                );
                break;
              case "italic":
                lineBuffer.appendToCurrentLine(formatLaTeX("emph", op.insert));
                break;
              default:
                throw Error(`Unknown attribute ${attribute}`);
            }
          }
        } else {
          // More than a newline and don't have attributes.
          lineBuffer.unpackMultipleLines(op.insert);
        }
      }
    }

    return lineBuffer.concatenateLines();
  }
}

@InputType()
export class LetterElementCreateInput {
  @Field(type => Int) sequence: number;
  @Field({ nullable: true }) textDelta?: string;
  @Field(type => Int, { nullable: true }) imageId?: number;
  @Field(type => Int) letterId: number;
  @Field(type => Int) letterElementTypeId: number;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}

@InputType()
export class LetterElementUpdateInput {
  @Field(type => Int) id: number;
  @Field(type => Int, { nullable: true }) sequence?: number;
  @Field({ nullable: true }) textDelta?: string;
  @Field(type => Int, { nullable: true }) imageId?: number;
  @Field(type => Int, { nullable: true }) letterElementTypeId?: number;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}
