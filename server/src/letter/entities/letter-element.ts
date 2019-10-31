import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Letter } from "./letter";
import { LetterElementType } from "./letter-element-type";
import { SurveyDimension } from "../../survey/entities";
import * as assert from "assert";

class LineBuffer {
  constructor(private allLines = [], private currentLine = "") {}

  flushCurrentLine() {
    if (this.currentLine.length > 0) {
      this.allLines.push(this.currentLine);
    }
    this.currentLine = "";
  }

  setCurrentLine(line: string) {
    this.flushCurrentLine();
    this.currentLine = line;
  }

  wrapCurrentLine(prefix: string, suffix: string) {
    this.currentLine = prefix + this.currentLine + suffix;
  }

  unpackMultipleLines(packed: string) {
    const unpacked = packed.split("\n");
    this.currentLine = unpacked.pop();
    this.allLines.push(...unpacked);
  }

  concatenateLines() {
    this.flushCurrentLine();
    return this.allLines.join("\n");
  }
}

@Entity()
@ObjectType()
export class LetterElement extends AbstractEntity {
  @Field(type => Int)
  @Column("int")
  sequence: number;

  @Column("text", { nullable: true })
  @Field({ nullable: true })
  textDelta?: string;

  @Column("integer") letterId: number;
  @ManyToOne(type => Letter, letter => letter.letterElements)
  @Field(type => Letter)
  letter: Letter;

  @Column("int") letterElementTypeId: number;
  @ManyToOne(type => LetterElementType)
  @Field(type => LetterElementType)
  letterElementType: LetterElementType;

  @Column("integer", { nullable: true }) surveyDimensionId: number;
  @ManyToOne(type => SurveyDimension)
  @Field(type => SurveyDimension, { nullable: true })
  surveyDimension?: SurveyDimension;

  asLaTeX() {
    assert.strictEqual(this.letterElementType.key, "boilerplate");

    const quillDelta = JSON.parse(this.textDelta);
    const lineBuffer = new LineBuffer();

    for (let op of quillDelta.ops) {
      assert.ok(op.hasOwnProperty("insert"));
      console.log(JSON.stringify(op, null, 2));

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
        lineBuffer.wrapCurrentLine(`\\${wrapper}{`, "}");
        lineBuffer.flushCurrentLine();
      } else {
        // Insert op that is not just a newline.
        if (op.hasOwnProperty("attributes")) {
          // More than a newline and has attributes.
          lineBuffer.setCurrentLine(op.insert);
          for (let attribute of Object.keys(op.attributes)) {
            console.log("ATTRIBUTE", attribute);
            switch (attribute) {
              case "bold":
                lineBuffer.wrapCurrentLine("\\textbf{", "}");
                break;
              case "italic":
                lineBuffer.wrapCurrentLine("\\emph{", "}");
                break;
              default:
                throw Error(`Unknown attribute ${attribute}`);
            }
          }
          lineBuffer.flushCurrentLine();
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
  @Field(type => Int) letterId: number;
  @Field(type => Int) sequence: number;
  @Field(type => Int) letterElementTypeId: number;
  @Field({ nullable: true }) textDelta?: string;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}

@InputType()
export class LetterElementUpdateInput {
  @Field(type => Int) id: number;
  @Field(type => Int, { nullable: true }) sequence?: number;
  @Field(type => Int, { nullable: true }) letterElementTypeId?: number;
  @Field({ nullable: true }) textDelta?: string;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}
