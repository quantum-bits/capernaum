import { Module } from "@nestjs/common";
import { entities } from "@server/src/typeorm-config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      logging: false,
      entities,
    }),
  ],
  exports: [TypeOrmModule],
})
export class FabricatorModule {}
