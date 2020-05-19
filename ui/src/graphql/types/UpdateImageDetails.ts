/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ImageUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateImageDetails
// ====================================================

export interface UpdateImageDetails_updateImage_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface UpdateImageDetails_updateImage {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  url: string;
  uuid: string;
  originalName: string;
  mimeType: string;
  created: any;
  updated: any;
  letterElements: UpdateImageDetails_updateImage_letterElements[];
}

export interface UpdateImageDetails {
  updateImage: UpdateImageDetails_updateImage;
}

export interface UpdateImageDetailsVariables {
  updateInput: ImageUpdateInput;
}
