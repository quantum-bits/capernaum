import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserRole } from "./entities";
import { UserResolver } from "./user.resolvers";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
