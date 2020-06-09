import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class QualtricsOrganization {
  @Field() id: string;
  @Field() name: string;
  @Field() baseUrl: string;
  @Field() type: string;
  @Field() status: string;
  @Field() creationDate: string;
  @Field() expirationDate: string;
}
