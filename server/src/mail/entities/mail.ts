import { Field, InputType } from "type-graphql";

@InputType()
export class SendLetterInput {
  @Field() to: string;
  @Field() subject: string;
  @Field() text: string;
}
