import { createParamDecorator } from "@nestjs/common";
import { User } from "../user/entities";

export const GqlUser = createParamDecorator(
  (data, [root, args, ctx, info]): User => ctx.req.user
);

export const GqlResponse = createParamDecorator(
  (data, [root, args, ctx, info]): Response => ctx.res
);
