import { Injectable } from "@nestjs/common";
import { TopLevelSpec } from "vega-lite";
import { makeChart } from "@helpers/vega";
import { Dimension, PredictionCount } from "@server/src/survey/survey.types";
import { PathLike } from "fs";

@Injectable()
export class VisualizationService {
  visualizePredictionCounts(
    predictionCounts: PredictionCount[],
    fileName: PathLike
  ) {
    const vegaLiteSpec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      title: "Prediction Counts",
      width: 400,
      data: {
        values: predictionCounts,
      },
      layer: [
        {
          mark: {
            type: "bar",
            cornerRadius: 8,
          },
          encoding: {
            color: {
              field: "predictCount",
              type: "quantitative",
              legend: null,
            },
          },
        },
        {
          mark: {
            type: "text",
            align: "right",
            xOffset: -4,
            color: "white",
          },
          encoding: {
            text: {
              field: "predictCount",
              type: "quantitative",
            },
          },
        },
      ],
      encoding: {
        x: {
          field: "predictCount",
          type: "quantitative",
          title: "Times Recommended",
        },
        y: {
          field: "practiceTitle",
          type: "nominal",
          sort: {
            encoding: "x",
            order: "descending",
          },
          title: null,
        },
      },
    };
    makeChart(vegaLiteSpec, fileName);
  }

  visualizeDimension(dimension: Dimension, fileName: PathLike) {
    const vegaLiteSpec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      data: {
        values: dimension.details,
      },
      title: dimension.title,
      layer: [
        {
          mark: {
            type: "bar",
            cornerRadius: 8,
            height: { band: 0.8 },
          },
          encoding: {
            color: {
              field: "meanSurveyIndex",
              type: "quantitative",
              legend: null,
            },
          },
        },
        {
          mark: {
            type: "text",
            align: "right",
            xOffset: -4,
            color: "white",
          },
          encoding: {
            text: {
              field: "meanSurveyIndex",
              type: "quantitative",
              format: ".1f",
            },
          },
        },
      ],
      encoding: {
        x: {
          field: "meanSurveyIndex",
          type: "quantitative",
          title: null,
          scale: { domain: [0, 7] },
        },
        y: {
          field: "indexTitle",
          type: "nominal",
          sort: {
            encoding: "x",
            order: "descending",
          },
          title: null,
        },
      },
    };
    makeChart(vegaLiteSpec, fileName);
  }
}
