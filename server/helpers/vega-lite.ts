import Debug from "debug";
import { compile, TopLevelSpec } from "vega-lite";
import vega from "vega";
import { createWriteStream, PathLike } from "fs";
import { Canvas } from "canvas";

const debug = Debug("vega-lite");

export function makeChart(vegaLiteSpec: TopLevelSpec, outputPath: PathLike) {
  const { spec, normalized } = compile(vegaLiteSpec);
  debug("normalized %O", normalized);

  // Create a Vega view based on the spec
  const vegaView = new vega.View(vega.parse(spec), { renderer: "none" });

  // Render the Vega view to a PDF file via `node-canvas`.
  vegaView
    .toCanvas(1, { type: "pdf" })
    .then((canvas: unknown) => {
      // The typings file declares the return value from `toCanvas`
      // as `Promise<HTMLCanvasElement>`, although the documentation
      // (https://vega.github.io/vega/docs/api/view/#view_toCanvas)
      // claims it is a `node-canvas` object when running on node.
      // This type guard should help avoid any problems.
      if (!(canvas instanceof Canvas)) {
        throw new Error("Vega view not returning Canvas");
      } else {
        const file = createWriteStream(outputPath);
        const stream = canvas.createPDFStream(); // create a png stream from the canvas
        stream.pipe(file); // write the stream to a file
      }
    })
    .catch((error) => {
      throw new Error(`Failed to convert Vega view to canvas: ${error}`);
    });
}

// Credits:
//    https://observablehq.com/@bmesuere/generating-images-using-vega-lite-and-node
