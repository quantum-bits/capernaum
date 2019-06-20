import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Survey {
    @Field()
    title: string;
}
