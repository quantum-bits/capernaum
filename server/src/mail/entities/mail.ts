import { Field, InputType } from "type-graphql";

@InputType()
export class SendMailInput {
  @Field({ nullable: true }) from?: string;
  @Field() to: string;
  @Field() subject: string;
  @Field() textContent: string;
  @Field({ nullable: true }) htmlContent?: string;
  @Field({ nullable: true }) attachmentPath?: string;
}
