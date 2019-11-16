/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ImageUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateImageDetails
// ====================================================

export interface UpdateImageDetails_updateImage {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  uuid: string;
  mimeType: string;
  originalName: string;
  url: string;
}

export interface UpdateImageDetails {
  updateImage: UpdateImageDetails_updateImage;
}

export interface UpdateImageDetailsVariables {
  updateInput: ImageUpdateInput;
}
