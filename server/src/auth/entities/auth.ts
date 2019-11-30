import { Field, InputType } from "type-graphql";

@InputType()
export class LoginCredentials {
  @Field() email: string;
  @Field() plainTextPassword: string;
}
