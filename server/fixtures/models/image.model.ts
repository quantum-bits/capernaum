import { Model } from "objection";

export class ImageModel extends Model {
  id!: number;
  originalName: string;
  mimeType: string;
  uuid: string;
  title: string;
  created: number;
  updated: number;

  static tableName = "image";
}
