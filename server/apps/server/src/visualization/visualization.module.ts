import { Module } from "@nestjs/common";
import { VisualizationService } from "@server/src/visualization/visualization.service";

@Module({
  providers: [VisualizationService],
  exports: [VisualizationService],
})
export class VisualizationModule {}
