import { Field, InputType, ObjectType } from "type-graphql";
import { UserRole } from "../../user/entities";

@InputType()
export class LoginCredentials {
  @Field() email: string;
  @Field() plainTextPassword: string;
}

@ObjectType()
export class AccessToken {
  @Field() accessToken: string;
}

export interface AccessTokenPayload {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
}
