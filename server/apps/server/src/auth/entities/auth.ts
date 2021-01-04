import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { UserPayload } from "../../user/entities";

@InputType()
export class LoginCredentials {
  @Field() email: string;
  @Field() password: string;
}

@ObjectType()
export class LoginResponse {
  @Field() accessToken: string;
  @Field(() => UserPayload) user: UserPayload;
}
