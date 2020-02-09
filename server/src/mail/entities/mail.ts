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
class Envelope {
  @Field() from: string;
  @Field(() => [String]) to: string[];
}

@ObjectType()
export class SendMailResponse {
  @Field(() => [String]) accepted: string[];
  @Field(() => [String]) rejected: string[];
  @Field() envelopeTime: number;
  @Field() messageTime: number;
  @Field() messageSize: number;
  @Field() response: string;
  @Field(() => Envelope) envelope: Envelope;
  @Field() messageId: string;
}
