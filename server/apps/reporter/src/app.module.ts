import { Module } from "@nestjs/common";
import { options } from "@server/src/typeorm-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { ReportModule } from "@reporter/src/report/report.module";
import { BullModule } from "@nestjs/bull";
import { ScheduleModule } from "@nestjs/schedule";
import { DaemonModule } from "@reporter/src/daemon/daemon.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...options,
    }),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
    ScheduleModule.forRoot(),
    ReportModule,
    DaemonModule,
  ],
})
export class AppModule {}
