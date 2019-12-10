import { Field, InputType, ObjectType } from "type-graphql";
import { UserPayload } from "../../user/entities";

@InputType()
export class LoginCredentials {
  @Field() email: string;
  @Field() plainTextPassword: string;
}

@ObjectType()
export class LoginResponse {
  @Field() accessToken: string;
  @Field(type => UserPayload) user: UserPayload;
}
