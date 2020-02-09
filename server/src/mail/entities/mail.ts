import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class SendMailInput {
  @Field({ nullable: true }) from?: string;
  @Field() to: string;
  @Field() subject: string;
  @Field() textContent: string;
  @Field({ nullable: true }) htmlContent?: string;
  @Field({ nullable: true }) attachmentPath?: string;
}

@ObjectType()
export class SendMailResponse {
  @Field() accepted: string[];
  @Field() rejected: string[];
  @Field() envelopeTime: number;
  @Field() messageTime: number;
  @Field() messageSize: number;
  @Field() response: string;
  @Field() envelope: { from: string; to: string[] };
  @Field() messageId: string;
}
