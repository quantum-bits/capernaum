import { Module } from "@nestjs/common";
import { UserRoleService, UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserRole } from "./entities";
import { UserResolver, UserRoleResolver } from "./user.resolvers";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UserService, UserResolver, UserRoleService, UserRoleResolver],
  exports: [UserService, UserResolver, UserRoleResolver],
})
export class UserModule {}
