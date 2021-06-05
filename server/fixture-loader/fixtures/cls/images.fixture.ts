import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { ImageModel } from "../../models/image.model";

const debug = getDebugger("image");

export class ImagesFixture extends AbstractFixture {
  delete() {
    debug("Delete images");
    return ImageModel.query().delete();
  }

  insert() {
    debug("Insert images");
    return ImageModel.query().insert(images);
  }
}

const images = [
  {
    id: 21,
    originalName: "cls results letter banner 2 copy - Copy.png",
    mimeType: "image/png",
    uuid: "5f53729a-94bf-4df0-9e10-e28e410db81c",
    title: "Allbrands3",
    created: "2020-05-13 13:39:44.025730",
    updated: "2020-05-13 13:39:52.174234",
  },
  {
    id: 22,
    originalName: "divider blue - Copy - Copy.png",
    mimeType: "image/png",
    uuid: "fd718ba6-be7c-40b8-97a7-2c889023758e",
    title: "Blue3",
    created: "2020-05-13 13:40:38.425953",
    updated: "2020-05-13 13:40:41.946355",
  },
  {
    id: 23,
    originalName: "divider green - Copy - Copy.png",
    mimeType: "image/png",
    uuid: "a4f5ab60-38a2-4d5c-bc87-9e19f6a71d66",
    title: "Green3",
    created: "2020-05-13 13:41:45.144801",
    updated: "2020-05-13 13:41:47.090564",
  },
  {
    id: 24,
    originalName: "divider orange - Copy - Copy.png",
    mimeType: "image/png",
    uuid: "bf6fc448-4bf7-4a34-82de-0e0ae1dd2089",
    title: "Orange3",
    created: "2020-05-13 13:41:58.719060",
    updated: "2020-05-13 13:42:00.569740",
  },
  {
    id: 25,
    originalName: "divider purple - Copy - Copy.png",
    mimeType: "image/png",
    uuid: "caf006c6-9e10-45df-970b-1e6913627f0e",
    title: "Purple3",
    created: "2020-05-13 13:42:11.181713",
    updated: "2020-05-13 13:42:13.517729",
  },
];
