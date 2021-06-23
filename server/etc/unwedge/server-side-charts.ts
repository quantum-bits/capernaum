import Debug from "debug";
import { compile, TopLevelSpec } from "vega-lite";
import * as vega from "vega";
import { createWriteStream } from "fs";
import { Canvas } from "canvas";

const debug = Debug("vega");

const vegaLiteSpec: TopLevelSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  mark: { type: "bar" },
  encoding: {
    x: { field: "key", type: "ordinal" },
    y: { field: "value", type: "quantitative" },
  },
  height: 200,
  data: {
    values: [
      { key: "A", value: 4 },
      { key: "B", value: 8 },
      { key: "C", value: 2 },
      { key: "D", value: 9 },
      { key: "E", value: 7 },
      { key: "F", value: 4 },
    ],
  },
};

const output = compile(vegaLiteSpec);
debug("output %O", output);

const vegaSpec = output.spec;

// Create a Vega view based on the spec
const view = new vega.View(vega.parse(vegaSpec), { renderer: "none" });

view.toCanvas(1, { type: "pdf" }).then((canvas: unknown) => {
  if (canvas instanceof Canvas) {
    const file = createWriteStream("output.pdf");
    const stream = canvas.createPDFStream(); // create a png stream from the canvas
    stream.pipe(file); // write the stream to a file
  } else {
    throw new Error("Vega view not returning Canvas");
  }
});

// Credits:
//    https://observablehq.com/@bmesuere/generating-images-using-vega-lite-and-node
